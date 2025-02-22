import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@guards';
import { User } from '@decorators';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto, GetQuestionsDto } from '@dtos';

@ApiTags('Questions')
@Controller('questions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a question' })
  @ApiResponse({ status: 201, description: 'Question created' })
  public createQuestion(
    @User('sub') recruiterId: number,
    @Body() dto: CreateQuestionDto,
  ) {
    return this.questionService.createQuestion(recruiterId, dto);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search questions with filters' })
  @ApiResponse({ status: 200, description: 'List of questions returned' })
  public searchQuestions(
    @User('sub') recruiterId: number,
    @Body() body: GetQuestionsDto,
  ) {
    return this.questionService.getAllQuestions(recruiterId, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  @ApiResponse({ status: 200, description: 'Question found' })
  public getQuestionById(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.questionService.getQuestionById(recruiterId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update question by ID' })
  @ApiResponse({ status: 200, description: 'Question updated' })
  public updateQuestion(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.updateQuestion(recruiterId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete question by ID' })
  @ApiResponse({ status: 200, description: 'Question deleted' })
  public deleteQuestion(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.questionService.deleteQuestion(recruiterId, id);
  }
}
