import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class RemoveQuestionFromListDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  public questionId: number;
} 