import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsUrl, Matches } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Leading tech company' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://techcorp.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'https://linkedin.com/company/techcorp' })
  @IsUrl()
  @IsOptional()
  @Matches(/^https?:\/\/(www\.)?linkedin\.com\/.*$/, {
    message: 'LinkedIn URL must be a valid LinkedIn profile URL',
  })
  linkedinUrl?: string;

  @IsOptional()
  logoUrl?: string;
}
