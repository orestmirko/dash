import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import CONFIG from '@config';
import { RecruiterEntity } from '@entities';
import { JwtException } from '@exceptions';

@Injectable()
export class CustomJwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  async generateTokens(recruiter: RecruiterEntity) {
    const payload = {
      sub: recruiter.id,
      role: recruiter.role,
      email: recruiter.email,
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
