import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruiterEntity } from '@entities';
import { CustomJwtService } from '@providers';
import { RedisService } from 'src/core/cache/redis.service';
import { LoginDto, RefreshTokenDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { verifyPassword } from '@utils';
import CONFIG from '@config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RecruiterEntity)
    private readonly recruiterRepository: Repository<RecruiterEntity>,
    private readonly jwtService: CustomJwtService,
    private readonly redisService: RedisService,
    private readonly logger: Logger,
  ) {}

  public async login(loginDto: LoginDto) {
    try {
      const attemptKey = `login_attempts:${loginDto.email}`;
      const attemptsStr = await this.redisService.get(attemptKey);
      const attemptsCount = parseInt(attemptsStr || '0', 10);

      if (attemptsCount >= CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS) {
        throw new UnauthorizedException('Too many login attempts. Try again later.');
      }

      const recruiter = await this.recruiterRepository.findOne({
        where: { email: loginDto.email },
      });

      if (!recruiter) {
        await this.increaseLoginAttempts(attemptKey, attemptsCount);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await verifyPassword(loginDto.password, recruiter.passwordHash);

      if (!isPasswordValid) {
        await this.increaseLoginAttempts(attemptKey, attemptsCount);
        throw new UnauthorizedException('Invalid credentials');
      }

      await this.redisService.del(attemptKey);

      const tokens = await this.jwtService.generateTokens(recruiter);
      const sessionKey = this.getSessionKey(recruiter.id, recruiter.role);

      await this.redisService.set(sessionKey, tokens.refreshToken, 30 * 24 * 60 * 60); // 30 days

      return tokens;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const decoded = await this.jwtService.verifyRefreshToken(refreshTokenDto.refreshToken);
      const sessionKey = this.getSessionKey(decoded.sub, decoded.role);
      const storedToken = await this.redisService.get(sessionKey);

      if (!storedToken || storedToken !== refreshTokenDto.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const recruiter = await this.recruiterRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!recruiter) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.jwtService.generateTokens(recruiter);
      await this.redisService.set(sessionKey, tokens.refreshToken, 30 * 24 * 60 * 60); // 30 days

      return tokens;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw error;
    }
  }

  public async logout(userId: number, role: RecruiterRole) {
    try {
      const sessionKey = this.getSessionKey(userId, role);
      await this.redisService.del(sessionKey);
    } catch (error) {
      this.logger.error(`Logout failed: ${error.message}`);
      throw error;
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

  private async increaseLoginAttempts(attemptKey: string, currentCount: number) {
    const newCount = currentCount + 1;
    await this.redisService.set(attemptKey, newCount.toString(), CONFIG.SECURITY.BLOCK_DURATION_SECONDS);
  }
}
