import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { JobStatus, JobType, SeniorityLevel, WorkLocation } from 'src/enums/job.enum';
import { Type } from 'class-transformer';

export class AdditionalMaterialDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsUrl()
  url: string;
}

export class CreateVacancyDto {
  @ApiProperty({ example: 'Senior Node.js Developer' })
  @IsString()
  @MinLength(2)
  @MaxLength(250)
  title: string;

  @ApiPropertyOptional({ example: 'We need a skilled Node.js dev...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: JobStatus, example: JobStatus.DRAFT })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @ApiPropertyOptional({ enum: JobType, example: JobType.FULL_TIME })
  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @ApiPropertyOptional({ enum: SeniorityLevel, example: SeniorityLevel.MIDDLE })
  @IsEnum(SeniorityLevel)
  @IsOptional()
  seniority?: SeniorityLevel;

  @ApiPropertyOptional({ enum: WorkLocation, example: WorkLocation.OFFICE })
  @IsEnum(WorkLocation)
  @IsOptional()
  locationType?: WorkLocation;

  @ApiPropertyOptional({ example: 'Kyiv, Ukraine' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryFrom?: number;

  @ApiPropertyOptional({ example: 2000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salaryTo?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ type: [String], example: ['Develop APIs', 'Maintain code'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  responsibilities?: string[];

  @ApiPropertyOptional({ type: [String], example: ['3+ years Node.js', 'SQL knowledge'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  requirements?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Node.js', 'TypeScript', 'SQL'] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  skills?: string[];

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isHot?: boolean;

  @ApiPropertyOptional({ example: 3, description: 'Years of experience required' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  experienceYears?: number;

  @ApiPropertyOptional({ type: [AdditionalMaterialDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdditionalMaterialDto)
  additionalMaterials?: AdditionalMaterialDto[];
}
