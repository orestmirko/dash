import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AdminInviteDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;
}
