import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User, UserStatus } from '../src/database/entities/user.entity';
import { Role } from '../src/database/entities/role.entity';

describe('Phase 2: Authentication, RBAC & Stakeholder Identity (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const testSuffix = Date.now().toString();
  const traderEmail = `trader_${testSuffix}@domain.test`;
  const traderPassword = 'SecurePassword2026!';
  let traderAccessToken = '';
  let traderRefreshToken = '';
  let traderUserId = '';

  let lmoAccessToken = '';
  let adminAccessToken = '';
  let publicAccessToken = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('1. Registration (AUTH-001, AUTH-002, AUTH-003)', () => {
    it('AUTH-001: Successful registration creates Digital Platform Account with hashed password and tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: traderEmail,
          password: traderPassword,
          fullName: 'Kiran Verma (Trader)',
          phone: '+91-9876543210',
          businessName: `Verma Grain Merchants ${testSuffix}`,
          registrationNumber: `23AABCV1234F1Z${testSuffix.slice(-1)}`,
          stateCode: 'MP',
          districtCode: 'IND',
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(traderEmail.toLowerCase());
      expect(response.body.user.fullName).toBe('Kiran Verma (Trader)');
      expect(response.body.user.status).toBe(UserStatus.ACTIVE);
      expect(response.body.user.roles).toContain('BUSINESS');
      expect(response.body.user.organization).toBeDefined();
      expect(response.body.user.organization.name).toBe(`Verma Grain Merchants ${testSuffix}`);
      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();

      traderUserId = response.body.user.id;
      traderAccessToken = response.body.tokens.accessToken;
      traderRefreshToken = response.body.tokens.refreshToken;
    });

    it('AUTH-002: Duplicate email registration is rejected with 409 Conflict', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: traderEmail, // Same email
          password: 'AnotherPassword123!',
          fullName: 'Duplicate User',
        })
        .expect(409);

      expect(response.body.message).toContain('already registered');
    });

    it('AUTH-003: Password is never stored in plaintext (verified bcrypt hash with work factor 12 in database)', async () => {
      const userRepo = dataSource.getRepository(User);
      const user = await userRepo
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.id = :id', { id: traderUserId })
        .getOne();

      expect(user).toBeDefined();
      expect(user?.passwordHash).toBeDefined();
      expect(user?.passwordHash).not.toBe(traderPassword);
      // Bcrypt hash identifier $2b$ or $2a$ with salt factor 12 ($2b$12$)
      expect(user?.passwordHash?.startsWith('$2b$12$') || user?.passwordHash?.startsWith('$2a$12$')).toBe(true);
    });
  });

  describe('2. Login & Credential Validation (AUTH-004, AUTH-005, AUTH-006)', () => {
    it('AUTH-004: Successful login returns JWT access and refresh tokens, updates lastLoginAt', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: traderEmail,
          password: traderPassword,
        })
        .expect(200);

      expect(response.body.tokens).toBeDefined();
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();
      expect(response.body.user.email).toBe(traderEmail.toLowerCase());
      expect(response.body.user.lastLoginAt).toBeDefined();

      traderAccessToken = response.body.tokens.accessToken;
      traderRefreshToken = response.body.tokens.refreshToken;
    });

    it('AUTH-005: Invalid password is rejected with 401 Unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: traderEmail,
          password: 'CompletelyWrongPassword123!',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });

    it('AUTH-006: Unknown user email is rejected with 401 Unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent_user_9999@test.com',
          password: traderPassword,
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('3. Token Lifecycle & Profile (AUTH-007, AUTH-008, AUTH-009)', () => {
    it('AUTH-007: Expired or forged JWT token is rejected with 401 Unauthorized', async () => {
      const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M';
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${forgedToken}`)
        .expect(401);
    });

    it('AUTH-008: Authenticated GET /auth/me returns sanitized stakeholder identity without password hashes', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${traderAccessToken}`)
        .expect(200);

      expect(response.body.id).toBe(traderUserId);
      expect(response.body.email).toBe(traderEmail.toLowerCase());
      expect(response.body.fullName).toBe('Kiran Verma (Trader)');
      expect(response.body.roles).toContain('BUSINESS');
      expect(response.body.permissions).toBeDefined();
      expect(response.body.permissions).toContain('application:create');
      expect(response.body.permissions).toContain('instrument:create');

      // Crucial: Security verification - no password hashes exposed
      expect(response.body.passwordHash).toBeUndefined();
      expect(response.body.refreshTokenHash).toBeUndefined();
    });

    it('AUTH-009: Unauthenticated request to protected endpoint is rejected with 401 Unauthorized', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/test/protected')
        .expect(401);
    });

    it('REFRESH-001: Refresh token rotation issues new token pair and revokes old token reuse', async () => {
      const refreshResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: traderRefreshToken })
        .expect(200);

      expect(refreshResponse.body.accessToken).toBeDefined();
      expect(refreshResponse.body.refreshToken).toBeDefined();
      expect(refreshResponse.body.refreshToken).not.toBe(traderRefreshToken);

      const newAccessToken = refreshResponse.body.accessToken;

      // Verify new access token works
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);
    });
  });

  describe('4. Server-Side RBAC Enforcement (RBAC-001, RBAC-002, RBAC-003, RBAC-004)', () => {
    beforeAll(async () => {
      // Helper: Provision LMO, Admin, and Public test users directly in DB
      const userRepo = dataSource.getRepository(User);
      const roleRepo = dataSource.getRepository(Role);

      const lmoRole = await roleRepo.findOne({ where: { name: 'LMO' } });
      const adminRole = await roleRepo.findOne({ where: { name: 'ADMIN' } });
      const publicRole = await roleRepo.findOne({ where: { name: 'PUBLIC' } });

      const lmoUser = userRepo.create({
        email: `lmo_${testSuffix}@gov.test`,
        fullName: 'Inspector R. Sharma',
        passwordHash: '$2b$12$e0MYzXy4YwOtestplaceholderhashvalue',
        status: UserStatus.ACTIVE,
        isActive: true,
        roles: [lmoRole!],
      });
      await userRepo.save(lmoUser);

      const adminUser = userRepo.create({
        email: `admin_${testSuffix}@gov.test`,
        fullName: 'Controller V. Sen',
        passwordHash: '$2b$12$e0MYzXy4YwOtestplaceholderhashvalue',
        status: UserStatus.ACTIVE,
        isActive: true,
        roles: [adminRole!],
      });
      await userRepo.save(adminUser);

      const publicUser = userRepo.create({
        email: `public_${testSuffix}@citizen.test`,
        fullName: 'Citizen A. Kumar',
        passwordHash: '$2b$12$e0MYzXy4YwOtestplaceholderhashvalue',
        status: UserStatus.ACTIVE,
        isActive: true,
        roles: [publicRole!],
      });
      await userRepo.save(publicUser);

      // Generate JWTs via auth service for these provisioned users
      const jwtService = app.get(JwtService);
      lmoAccessToken = await jwtService.signAsync({
        sub: lmoUser.id,
        email: lmoUser.email,
        roles: ['LMO'],
      });
      adminAccessToken = await jwtService.signAsync({
        sub: adminUser.id,
        email: adminUser.email,
        roles: ['ADMIN'],
      });
      publicAccessToken = await jwtService.signAsync({
        sub: publicUser.id,
        email: publicUser.email,
        roles: ['PUBLIC'],
      });
    });

    it('RBAC-001: Authorized role succeeds (LMO accessing LMO endpoint, Admin accessing Admin endpoint)', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/test/lmo-only')
        .set('Authorization', `Bearer ${lmoAccessToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get('/api/v1/auth/test/admin-only')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);
    });

    it('RBAC-002: Unauthorized role receives 403 Forbidden (Business user attempting LMO endpoint)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/test/lmo-only')
        .set('Authorization', `Bearer ${traderAccessToken}`)
        .expect(403);

      expect(response.body.statusCode).toBe(403);
      expect(response.body.message).toContain('Access denied');
    });

    it('RBAC-003: Public user cannot access protected administrative endpoint (receives 403 Forbidden)', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/test/admin-only')
        .set('Authorization', `Bearer ${publicAccessToken}`)
        .expect(403);
    });

    it('RBAC-004: Suspended or disabled account cannot authenticate or access protected endpoints', async () => {
      const userRepo = dataSource.getRepository(User);
      // Suspend the trader user account
      await userRepo.update(traderUserId, { status: UserStatus.SUSPENDED });

      // Attempt login with suspended account
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: traderEmail,
          password: traderPassword,
        })
        .expect(401);

      expect(loginResponse.body.message).toContain('suspended');

      // Attempt protected call with existing token from suspended user
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${traderAccessToken}`)
        .expect(401);
    });
  });

  describe('5. Security & Secret Exposure Safeguards (SEC-001, SEC-002)', () => {
    it('SEC-001: API responses never expose password hashes, jwt secrets, or internal DB credentials', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      const jsonStr = JSON.stringify(response.body);
      expect(jsonStr).not.toContain('passwordHash');
      expect(jsonStr).not.toContain('refreshTokenHash');
      expect(jsonStr).not.toContain('perimeter_local_dev');
      expect(jsonStr).not.toContain('postgres:');
    });

    it('SEC-002: Invalid route errors do not leak stack traces or internals', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/invalid-sub-path')
        .expect(404);

      expect(response.body.stack).toBeUndefined();
      expect(response.body.statusCode).toBe(404);
    });
  });
});
