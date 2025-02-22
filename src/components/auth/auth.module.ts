import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RecruiterEntity } from '@entities';
import { RedisModule } from 'src/core/cache/redis.module';
import { JwtModule } from '../jwt/jwt.module';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecruiterEntity]), RedisModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, Logger],
  exports: [AuthService],
})
export class AuthModule {}
