import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsArray, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateQuestionPoolDto {
  @ApiProperty({ example: 'Frontend Junior Quiz' })
  @IsString()
  @Length(1, 250)
  public title: string;

  @ApiProperty({ example: 'Basic questions for frontend developers' })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({ example: [1, 2, 3], description: 'Array of question IDs (max 50)' })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsOptional()
  public questionIds?: number[];
}
