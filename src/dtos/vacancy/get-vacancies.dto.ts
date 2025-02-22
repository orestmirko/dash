import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsArray, IsNumber, Min } from 'class-validator';
import { JobStatus, JobType, SeniorityLevel, WorkLocation } from '@enums';
import { PaginationDto } from '../common/pagination.dto';

export class GetVacanciesDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'Node.js' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: JobStatus })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @ApiPropertyOptional({ enum: JobType })
  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @ApiPropertyOptional({ enum: SeniorityLevel })
  @IsEnum(SeniorityLevel)
  @IsOptional()
  seniority?: SeniorityLevel;

  @ApiPropertyOptional({ enum: WorkLocation })
  @IsEnum(WorkLocation)
  @IsOptional()
  locationType?: WorkLocation;

  @ApiPropertyOptional({ example: ['Node.js', 'TypeScript'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  skills?: string[];

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  isHot?: boolean;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  salaryFrom?: number;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  salaryTo?: number;
} 