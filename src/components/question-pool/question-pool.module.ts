import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionPoolEntity, QuestionEntity, RecruiterEntity } from '@entities';
import { RedisModule } from 'src/core/cache/redis.module';
import { EmailModule } from '../email/email.module';
import { JwtModule } from '../jwt/jwt.module';
import { QuestionPoolController } from './question-pool.controller';
import { QuestionPoolService } from './question-pool.service';
import { QuestionPoolRepository } from '@repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionPoolEntity, QuestionEntity, RecruiterEntity]),
    RedisModule,
    EmailModule,
    JwtModule,
  ],
  controllers: [QuestionPoolController],
  providers: [QuestionPoolService, Logger, QuestionPoolRepository],
  exports: [QuestionPoolService],
})
export class QuestionPoolModule {}
