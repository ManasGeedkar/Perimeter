import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { Organization, OrganizationType } from '../database/entities/organization.entity';
import { Jurisdiction } from '../database/entities/jurisdiction.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: string;
}

export interface SanitizedUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  status: UserStatus;
  roles: string[];
  permissions: string[];
  organization?: {
    id: string;
    name: string;
    type: string;
    registrationNumber?: string;
  } | null;
  jurisdiction?: {
    id: string;
    stateCode: string;
    districtCode: string;
    stateName: string;
    districtName: string;
  } | null;
  createdAt: Date;
  lastLoginAt?: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(Jurisdiction)
    private readonly jurisdictionRepo: Repository<Jurisdiction>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async register(dto: RegisterDto): Promise<{ user: SanitizedUser; tokens: AuthTokens }> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email.toLowerCase().trim() } });
    if (existing) {
      throw new ConflictException('Email address is already registered');
    }

    // Resolve Jurisdiction if provided
    let jurisdiction: Jurisdiction | null = null;
    if (dto.stateCode && dto.districtCode) {
      jurisdiction = await this.jurisdictionRepo.findOne({
        where: { stateCode: dto.stateCode.toUpperCase(), districtCode: dto.districtCode.toUpperCase() },
      });
    }

    // Resolve or Create Organization for Business User
    let organization: Organization | null = null;
    if (dto.businessName) {
      organization = this.orgRepo.create({
        name: dto.businessName.trim(),
        type: OrganizationType.BUSINESS,
        registrationNumber: dto.registrationNumber?.trim(),
        jurisdiction: jurisdiction || undefined,
        isActive: true,
      });
      organization = await this.orgRepo.save(organization);
    }

    // Assign default BUSINESS role for self-registration
    const businessRole = await this.roleRepo.findOne({
      where: { name: 'BUSINESS' },
      relations: ['permissions'],
    });

    if (!businessRole) {
      throw new InternalServerErrorException('Default BUSINESS role not configured in database');
    }

    const passwordHash = await this.hashPassword(dto.password);

    const user = this.userRepo.create({
      email: dto.email.toLowerCase().trim(),
      fullName: dto.fullName.trim(),
      phone: dto.phone?.trim(),
      passwordHash,
      status: UserStatus.ACTIVE,
      isActive: true,
      roles: [businessRole],
      organization: organization || undefined,
      jurisdiction: jurisdiction || undefined,
    });

    const savedUser = await this.userRepo.save(user);

    // Issue token pair
    const tokens = await this.generateTokens(savedUser);

    // Hash and store refresh token for secure revocation/rotation
    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.update(savedUser.id, {
      refreshTokenHash,
      lastLoginAt: new Date(),
    });

    this.logger.log(`New digital platform account registered: ${savedUser.id} (${savedUser.email})`);

    const sanitized = await this.getProfile(savedUser.id);
    return { user: sanitized, tokens };
  }

  async login(dto: LoginDto): Promise<{ user: SanitizedUser; tokens: AuthTokens }> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.jurisdiction', 'jurisdiction')
      .where('user.email = :email', { email })
      .getOne();

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await this.comparePassword(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== UserStatus.ACTIVE || !user.isActive) {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()} and cannot authenticate`);
    }

    const tokens = await this.generateTokens(user);

    const refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.update(user.id, {
      refreshTokenHash,
      lastLoginAt: new Date(),
    });

    this.logger.log(`User logged in successfully: ${user.id} (${user.email})`);

    const sanitized = await this.getProfile(user.id);
    return { user: sanitized, tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'perimeter_local_dev_refresh_secret_2026_sih',
    );

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshTokenHash')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id: payload.sub })
      .getOne();

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token is invalid or has been revoked');
    }

    if (user.status !== UserStatus.ACTIVE || !user.isActive) {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}`);
    }

    const isTokenMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isTokenMatch) {
      // Possible token reuse attempt: clear stored hash
      await this.userRepo.update(user.id, { refreshTokenHash: undefined });
      throw new UnauthorizedException('Refresh token rotation violation detected');
    }

    // Generate new token pair (rotation)
    const newTokens = await this.generateTokens(user);
    const newRefreshTokenHash = await bcrypt.hash(newTokens.refreshToken, 10);
    await this.userRepo.update(user.id, { refreshTokenHash: newRefreshTokenHash });

    return newTokens;
  }

  async getProfile(userId: string): Promise<SanitizedUser> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions', 'organization', 'jurisdiction'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roleNames = (user.roles || []).map((r) => r.name);
    const permissionSet = new Set<string>();
    for (const r of user.roles || []) {
      for (const p of r.permissions || []) {
        permissionSet.add(p.code);
      }
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      roles: roleNames,
      permissions: Array.from(permissionSet),
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            type: user.organization.type,
            registrationNumber: user.organization.registrationNumber,
          }
        : null,
      jurisdiction: user.jurisdiction
        ? {
            id: user.jurisdiction.id,
            stateCode: user.jurisdiction.stateCode,
            districtCode: user.jurisdiction.districtCode,
            stateName: user.jurisdiction.stateName,
            districtName: user.jurisdiction.districtName,
          }
        : null,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const roleNames = (user.roles || []).map((r) => r.name);
    const payload = {
      sub: user.id,
      email: user.email,
      roles: roleNames,
      orgId: user.organization_id || undefined,
      jurisdictionId: user.jurisdiction_id || undefined,
    };

    const accessTokenExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'perimeter_local_dev_refresh_secret_2026_sih',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiresIn as any,
      }),
      this.jwtService.signAsync(
        { sub: user.id, email: user.email, jti: crypto.randomUUID() },
        {
          secret: refreshSecret,
          expiresIn: refreshExpiresIn as any,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
      tokenType: 'Bearer',
    };
  }
}
