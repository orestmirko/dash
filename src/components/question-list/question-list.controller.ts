import { Body, Controller, Post, UseGuards, Delete, Param, ParseIntPipe, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionListDto, AddQuestionsToListDto, GetQuestionListsDto } from '@dtos';
import { AuthGuard } from '@guards';
import { User } from '@decorators';
import { QuestionListService } from './question-list.service';
import { PaginationDto } from '@dtos';

@ApiTags('Question Lists')
@Controller('question-lists')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class QuestionListController {
  constructor(private readonly questionListService: QuestionListService) {}

  @Post()
  @ApiOperation({ summary: 'Create questions list' })
  @ApiResponse({
    status: 201,
    description: 'Questions list created successfully',
  })
  public createQuestionList(
    @User('sub') recruiterId: number,
    @Body() createQuestionListDto: CreateQuestionListDto,
  ) {
    return this.questionListService.createQuestionList(recruiterId, createQuestionListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all question lists' })
  @ApiResponse({
    status: 200,
    description: 'Question lists retrieved successfully',
  })
  public getLists(
    @User('sub') recruiterId: number,
    @Query() query: GetQuestionListsDto,
  ) {
    return this.questionListService.getLists(recruiterId, query);
  }

  @Post('add-questions')
  @ApiOperation({ summary: 'Add questions to list' })
  @ApiResponse({
    status: 201,
    description: 'Questions added to list successfully',
  })
  public addQuestionsToList(
    @User('sub') recruiterId: number,
    @Body() addQuestionsToListDto: AddQuestionsToListDto,
  ) {
    return this.questionListService.addQuestionsToList(recruiterId, addQuestionsToListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete question list' })
  @ApiResponse({
    status: 200,
    description: 'Question list deleted successfully',
  })
  public deleteQuestionList(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.questionListService.deleteQuestionList(recruiterId, id);
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'Get all questions in list' })
  @ApiResponse({
    status: 200,
    description: 'Questions retrieved successfully',
  })
  public getListQuestions(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) listId: number,
    @Query() query: PaginationDto,
  ) {
    return this.questionListService.getListQuestions(recruiterId, listId, query);
  }
}
