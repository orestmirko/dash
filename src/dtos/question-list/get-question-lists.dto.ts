import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../common/pagination.dto';

export class GetQuestionListsDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'JavaScript' })
  @IsString()
  @IsOptional()
  search?: string;
} 