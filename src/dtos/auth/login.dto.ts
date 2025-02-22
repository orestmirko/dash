import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, { message: 'Email must be between 5 and 100 characters' })
  email: string;

  @ApiProperty({ example: 'Qwerty123!' })
  @IsString()
  password: string;
}
