import { PrescreenExpirationPreset } from '@enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, IsOptional, IsEnum, IsNumber, IsDate } from 'class-validator';

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

  @ApiProperty({ example: 1 })
  @IsNumber()
  public vacancyId: number;

  @ApiProperty({ enum: PrescreenExpirationPreset })
  @IsEnum(PrescreenExpirationPreset)
  @IsOptional()
  public expirationPreset?: PrescreenExpirationPreset;

  @ApiProperty({ example: '2024-04-01' })
  @IsDate()
  @IsOptional()
  public expirationDate?: Date;
}
