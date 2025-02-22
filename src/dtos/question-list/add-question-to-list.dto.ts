import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class AddQuestionsToListDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  public questionListId: number;

  @ApiProperty({ example: [1, 2, 3], description: 'Array of question IDs' })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  public questionIds: number[];
}
