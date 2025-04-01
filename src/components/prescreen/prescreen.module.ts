import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterController } from './prescreen.controller';
import { RecruiterService } from './prescreen.service';
import { PrescreenEntity } from '@entities';
import { RedisModule } from 'src/core/cache/redis.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '../jwt/jwt.module';
import { AuthGuard } from '@guards';

@Module({
  imports: [TypeOrmModule.forFeature([PrescreenEntity]), RedisModule, EmailModule, JwtModule],
  controllers: [RecruiterController],
  providers: [RecruiterService, Logger, AuthGuard],
  exports: [RecruiterService],
})
export class RecruiterModule {}
