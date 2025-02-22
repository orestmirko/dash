import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity, QuestionListEntity, RecruiterEntity } from '@entities';
import { RedisModule } from 'src/core/cache/redis.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '../jwt/jwt.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionListRepository } from '@repositories';
import { QuestionRepository } from 'src/core/database/repositories/question.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionEntity, QuestionListEntity, RecruiterEntity]),
    RedisModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, Logger, QuestionListRepository, QuestionRepository],
  exports: [QuestionService],
})
export class QuestionModule {}
