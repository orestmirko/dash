import { Injectable, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { CustomJwtService } from '@providers';
import { RedisService } from '../cache/redis.service';
import { RecruiterRole } from '@enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RecruiterRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: CustomJwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || request.headers.Authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization is required');
    }

    const [bearer, token] = authHeader.toString().split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(token);
      const sessionKey = this.getSessionKey(payload.sub, payload.role);
      const sessionExists = await this.redisService.exists(sessionKey);

      if (!sessionExists) {
        throw new UnauthorizedException('Session expired or not found');
      }

      const requiredRoles = Reflect.getMetadata(ROLES_KEY, context.getHandler());
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        throw new UnauthorizedException(
          `Role ${payload.role} is not authorized to access this resource`,
        );
      }

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private getSessionKey(userId: number, role: RecruiterRole): string {
    switch (role) {
      case RecruiterRole.ADMIN:
        return `recruiter_admin_session:${userId}`;
      case RecruiterRole.FREELANCER:
        return `recruiter_freelancer_session:${userId}`;
      default:
        return `recruiter_session:${userId}`;
    }
  }
}
