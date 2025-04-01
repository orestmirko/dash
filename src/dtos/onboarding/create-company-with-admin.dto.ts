import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, ValidateNested, IsUrl, IsEnum, MaxLength, NotContains, IsStrongPassword, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanySize } from '@enums';
import { PASSWORD_CONSTANTS } from '@constants';

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
  @IsString()
  @MaxLength(20)
  @NotContains(' ', { message: 'Password should not contain spaces' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  @Matches(PASSWORD_CONSTANTS.SPECIAL_CHARS_REGEX, {
    message: 'Password must contain at least one special character (e.g., !, @, #, $, etc.)',
  })
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatarUrl?: string;
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
