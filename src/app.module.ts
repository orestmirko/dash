import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { CompanyManagementModule, AuthModule, OnboardingModule, VacancyModule, QuestionModule } from '@modules';
import { ScheduleModule } from '@nestjs/schedule';
import { CronTaskModule } from './cron';

@Module({
  imports: [
    DatabaseModule,
    CronTaskModule,
    ScheduleModule.forRoot(),
    OnboardingModule,
    AuthModule,
    CompanyManagementModule,
    VacancyModule,
    QuestionModule,
  ],
})
export class AppModule {}
