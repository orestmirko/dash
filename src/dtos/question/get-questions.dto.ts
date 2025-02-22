import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean, IsArray, IsNumber } from 'class-validator';
import { QuestionType } from '@enums';
import { PaginationDto } from '../common/pagination.dto';

export class GetQuestionsDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'react' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: QuestionType })
  @IsEnum(QuestionType)
  @IsOptional()
  type?: QuestionType;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({ example: [1, 2, 3], description: 'Array of question IDs' })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  ids?: number[];
} 