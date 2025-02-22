import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class AddQuestionsToPoolDto {
  @ApiProperty({ example: [1, 2, 3], description: 'Array of question IDs' })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  public questionIds: number[];
}
