import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard, RolesGuard } from '../common/guards/index.js';
import { Roles, CurrentUser } from '../common/decorators/index.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  // --- Server-side RBAC Test Endpoints ---

  @Get('test/protected')
  @UseGuards(JwtAuthGuard)
  testProtected(@CurrentUser() user: any) {
    return {
      message: 'Access granted to authenticated user',
      userId: user.id,
      email: user.email,
    };
  }

  @Get('test/admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  testAdminOnly(@CurrentUser() user: any) {
    return {
      message: 'Access granted to ADMIN role',
      userId: user.id,
    };
  }

  @Get('test/lmo-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LMO')
  testLmoOnly(@CurrentUser() user: any) {
    return {
      message: 'Access granted to LMO role',
      userId: user.id,
    };
  }

  @Get('test/business-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BUSINESS')
  testBusinessOnly(@CurrentUser() user: any) {
    return {
      message: 'Access granted to BUSINESS role',
      userId: user.id,
    };
  }
}
