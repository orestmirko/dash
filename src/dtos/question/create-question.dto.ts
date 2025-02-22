import { QuestionType } from '@enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    enum: QuestionType,
    example: QuestionType.TEXT,
    description: 'Type of the question (e.g., "text")',
  })
  @IsEnum(QuestionType)
  @IsOptional()
  type: QuestionType;

  @ApiProperty({ example: 'Tell us about your experience' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;
}
