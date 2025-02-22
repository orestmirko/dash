import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength, ValidateNested, IsUrl, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanySize } from '@enums';

export class CreateAdminDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  imageUrl?: string;
}

export class CreateCompanyWithAdminDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'website must be a valid URL' })
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({}, { message: 'linkedinUrl must be a valid URL' })
  linkedinUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    required: false,
    enum: CompanySize,
    description: 'Company size',
  })
  @IsOptional()
  @IsEnum(CompanySize)
  companySize?: CompanySize;

  @ApiProperty({ type: () => CreateAdminDto })
  @ValidateNested()
  @Type(() => CreateAdminDto)
  admin: CreateAdminDto;
}
