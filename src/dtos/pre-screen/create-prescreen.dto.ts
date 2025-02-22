import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreatePrescreenDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, { message: 'Email must be between 5 and 100 characters' })
  public candidateEmail: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  public candidateFirstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  public candidateLastName?: string;

  @ApiProperty({ example: 24, description: 'Link expiration time in hours' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(168) // 1 week
  public expirationHours?: number = 24;
}
