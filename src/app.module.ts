import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { CompanyManagementModule, AuthModule, OnboardingModule, VacancyModule, QuestionModule, QuestionListModule, QuestionPoolModule } from '@modules';
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
    QuestionListModule,
    QuestionPoolModule,
  ],
})
export class AppModule {}
