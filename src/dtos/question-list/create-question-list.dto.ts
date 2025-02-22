import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, Matches } from 'class-validator';

export class CreateQuestionListDto {
  @ApiProperty({ example: 'Frontend Interview Questions' })
  @IsString()
  @Length(2, 150)
  @Matches(/^(?!General$).*$/i, {
    message: 'Title cannot be "General" (case-insensitive)',
  })
  public title: string;

  @ApiProperty({ example: 'Common questions for frontend developers' })
  @IsString()
  @IsOptional()
  public description?: string;
}
