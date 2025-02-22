import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../common/pagination.dto';

export class GetQuestionPoolsDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'Frontend' })
  @IsString()
  @IsOptional()
  search?: string;
} 