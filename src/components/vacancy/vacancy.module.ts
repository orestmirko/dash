import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacancyController } from './vacancy.controller';
import { VacancyService } from './vacancy.service';
import { RecruiterEntity } from '@entities';
import { RedisModule } from 'src/core/cache/redis.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '../jwt/jwt.module';
import { VacancyRepository } from '@repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([VacancyRepository, RecruiterEntity]),
    RedisModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [VacancyController],
  providers: [VacancyService, Logger],
  exports: [VacancyService],
})
export class VacancyModule {}
