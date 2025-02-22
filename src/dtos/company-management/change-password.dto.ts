import { PASSWORD_CONSTANTS } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, NotContains, IsStrongPassword, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'QwertyOld123!',
    description: 'Current (old) password of the user',
  })
  @IsString()
  public currentPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password that meets the strength requirements',
  })
  @IsString()
  @MaxLength(20, { message: 'Password can not exceed 20 characters' })
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
    message: 'Password must contain at least one special character (e.g. !, @, #, $, etc.)',
  })
  public newPassword: string;
}
