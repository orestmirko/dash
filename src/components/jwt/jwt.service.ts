import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import CONFIG from '@config';
import { UserEntity, AdminEntity } from '@entities';
import { JwtException } from '@exceptions';

@Injectable()
export class CustomJwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  async generateTokens(user: UserEntity | AdminEntity) {
    const isAdmin = user instanceof AdminEntity;
    const payload = {
      sub: user.id,
      role: isAdmin ? 'admin' : 'user',
      ...(isAdmin ? { email: (user as AdminEntity).email } : { phone: (user as UserEntity).phone }),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.nestJwtService.signAsync(payload, {
        secret: CONFIG.JWT.ACCESS_SECRET,
        expiresIn: CONFIG.JWT.ACCESS_EXPIRATION,
      }),
      this.nestJwtService.signAsync(payload, {
        secret: CONFIG.JWT.REFRESH_SECRET,
        expiresIn: CONFIG.JWT.REFRESH_EXPIRATION,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string) {
    return this.nestJwtService.verifyAsync(token, {
      secret: CONFIG.JWT.ACCESS_SECRET,
    });
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.nestJwtService.verifyAsync(token, {
        secret: CONFIG.JWT.REFRESH_SECRET,
      });
    } catch (error) {
      throw new JwtException('Invalid refresh token');
    }
  }
}
