import { Body, Controller, Post, UseGuards, Param, ParseIntPipe, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionPoolDto, AddQuestionsToPoolDto, GetQuestionPoolsDto } from '@dtos';
import { AuthGuard } from '@guards';
import { User } from '@decorators';
import { QuestionPoolService } from './question-pool.service';

@ApiTags('Question Pools')
@Controller('question-pools')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class QuestionPoolController {
  constructor(private readonly questionPoolService: QuestionPoolService) {}

  @Post()
  @ApiOperation({ summary: 'Create question pool' })
  @ApiResponse({
    status: 201,
    description: 'Question pool created successfully',
  })
  public createQuestionPool(
    @User('sub') recruiterId: number,
    @Body() createQuestionPoolDto: CreateQuestionPoolDto,
  ) {
    return this.questionPoolService.createQuestionPool(recruiterId, createQuestionPoolDto);
  }

  @Post(':id/questions')
  @ApiOperation({ summary: 'Add questions to question pool' })
  @ApiResponse({
    status: 201,
    description: 'Questions added to pool successfully',
  })
  public addQuestionsToPool(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) poolId: number,
    @Body() addQuestionsDto: AddQuestionsToPoolDto,
  ) {
    return this.questionPoolService.addQuestionsToPool(recruiterId, poolId, addQuestionsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all question pools' })
  @ApiResponse({
    status: 200,
    description: 'Question pools retrieved successfully',
  })
  public getQuestionPools(
    @User('sub') recruiterId: number,
    @Query() query: GetQuestionPoolsDto,
  ) {
    return this.questionPoolService.getQuestionPools(recruiterId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question pool by ID with questions' })
  @ApiResponse({
    status: 200,
    description: 'Question pool retrieved successfully',
  })
  public getQuestionPoolById(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) poolId: number,
  ) {
    return this.questionPoolService.getQuestionPoolById(recruiterId, poolId);
  }

  @Post(':id/assign-to-vacancy/:vacancyId')
  @ApiOperation({ summary: 'Assign question pool to vacancy' })
  @ApiResponse({
    status: 200,
    description: 'Question pool assigned to vacancy successfully',
  })
  public assignToVacancy(
    @User('sub') recruiterId: number,
    @Param('id', ParseIntPipe) poolId: number,
    @Param('vacancyId', ParseIntPipe) vacancyId: number,
  ) {
    return this.questionPoolService.assignToVacancy(recruiterId, poolId, vacancyId);
  }
}
