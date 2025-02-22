import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity, RecruiterEntity } from '@entities';
import { OnboardingService } from './onboarding.service';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, RecruiterEntity]), AuthModule, EmailModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
