import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  ArrayUnique,
  MinLength,
  MaxLength,
} from 'class-validator';
import { JobStatus, JobType, SeniorityLevel, WorkLocation } from 'src/enums/job.enum';

export class UpdateVacancyDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(250)
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

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

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryFrom?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryTo?: number;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(10)
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  responsibilities?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  requirements?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  skills?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  experienceYears?: number;
}
