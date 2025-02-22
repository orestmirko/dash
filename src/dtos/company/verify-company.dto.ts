import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CompanyVerifyDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  @Length(2, 100)
  companyName: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @Length(5, 5, { message: 'Code must be exactly 5 characters' })
  @Matches(/^\d{5}$/, {
    message: 'Code must contain exactly 5 digits',
  })
  code: string;
}
