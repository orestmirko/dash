import { PASSWORD_CONSTANTS } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  Matches,
  IsEmail,
  MaxLength,
  NotContains,
  IsStrongPassword,
} from 'class-validator';

export class AdminSignUpDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, { message: 'Email must be between 5 and 100 characters' })
  public email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  @Matches(/^[а-яА-ЯёЁіІїЇєЄґҐa-zA-Z\s]*$/, {
    message: 'First name can only contain letters and spaces',
  })
  public firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  @Matches(/^[а-яА-ЯёЁіІїЇєЄґҐa-zA-Z\s]*$/, {
    message: 'Last name can only contain letters and spaces',
  })
  public lastName: string;

  @ApiProperty({
    example: 'Qwerty123!',
  })
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
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  @Matches(PASSWORD_CONSTANTS.SPECIAL_CHARS_REGEX, {
    message: 'Password must contain at least one special character (e.g., !, @, #, $, etc.)',
  })
  password: string;
}
