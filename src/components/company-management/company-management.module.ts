import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyManagementController } from './company-management.controller';
import { CompanyEntity, RecruiterEntity } from '@entities';
import { RedisModule } from 'src/core/cache/redis.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '../jwt/jwt.module';
import { CompanyManagementService } from './company-management.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecruiterEntity, CompanyEntity]),
    RedisModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [CompanyManagementController],
  providers: [CompanyManagementService, Logger],
  exports: [CompanyManagementService],
})
export class CompanyManagementModule {}
