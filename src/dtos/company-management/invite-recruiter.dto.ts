import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail, Matches } from 'class-validator';

export class InviteRecruiterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, { message: 'Email must be between 5 and 100 characters' })
  public email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  @Matches(/^[\p{L}\s]*$/u, {
    message: 'First name can only contain letters and spaces',
  })
  public firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  @Matches(/^[\p{L}\s]*$/u, {
    message: 'Last name can only contain letters and spaces',
  })
  public lastName: string;
}
