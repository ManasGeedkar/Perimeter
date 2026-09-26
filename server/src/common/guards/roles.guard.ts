import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { UserStatus } from '../../database/entities/user.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Access denied: Unauthenticated user');
    }

    if (user.status && user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(`Access denied: Account status is ${user.status}`);
    }

    const userRoleNames: string[] = (user.roles || []).map((r: any) =>
      typeof r === 'string' ? r : r.name,
    );

    const hasRole = requiredRoles.some((role) => userRoleNames.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: required role (${requiredRoles.join(', ')}) not assigned to user`,
      );
    }

    return true;
  }
}
