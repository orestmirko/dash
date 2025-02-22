import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionListController } from './question-list.controller';
import { QuestionListService } from './question-list.service';
import { QuestionListEntity, QuestionEntity, RecruiterEntity } from '@entities';
import { QuestionListRepository } from '@repositories';
import { RedisModule } from 'src/core/cache/redis.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionListEntity, QuestionEntity, RecruiterEntity]),
    RedisModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [QuestionListController],
  providers: [QuestionListService, Logger, QuestionListRepository],
  exports: [QuestionListService],
})
export class QuestionListModule {}
