import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { QuestionListEntity, QuestionEntity, RecruiterEntity } from '@entities';
import { CreateQuestionListDto, AddQuestionsToListDto, PaginationDto, GetQuestionListsDto } from '@dtos';
import { QuestionListRepository } from '@repositories';
import { RecruiterRole } from '@enums';
import { PaginatedResponse } from '@interfaces';
import { User } from '@decorators';
import { Query } from '@nestjs/common';

@Injectable()
export class QuestionListService {
  constructor(
    @InjectRepository(RecruiterEntity)
    private readonly recruiterRepository: Repository<RecruiterEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private readonly questionListRepository: QuestionListRepository,
    private readonly logger: Logger,
  ) {}

  public async createQuestionList(
    recruiterId: number,
    createQuestionListDto: CreateQuestionListDto,
  ): Promise<QuestionListEntity> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      if (recruiter.role !== RecruiterRole.FREELANCER && !recruiter.company) {
        throw new NotFoundException('Recruiter company not found');
      }

      const questionList = this.questionListRepository.create({
        title: createQuestionListDto.title,
        description: createQuestionListDto.description,
        createdBy: { id: recruiterId },
        questions: [],
      });

      await this.questionListRepository.save(questionList);

      this.logger.log(`Created question list: ${questionList.title}`);
      return questionList;
    } catch (error) {
      this.logger.error(`Failed to create question list: ${error.message}`);
      throw error;
    }
  }

  public async addQuestionsToList(
    recruiterId: number,
    addQuestionsToListDto: AddQuestionsToListDto,
  ): Promise<QuestionListEntity> {
    try {
      const { questionListId, questionIds } = addQuestionsToListDto;

      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      const questionList = await this.questionListRepository.findOne({
        where: { id: questionListId },
        relations: ['questions', 'createdBy', 'createdBy.company'],
      });

      if (!questionList) {
        throw new NotFoundException(`Question list with ID ${questionListId} not found`);
      }

      if (recruiter.role === RecruiterRole.FREELANCER) {
        if (questionList.createdBy.id !== recruiterId) {
          throw new NotFoundException('Question list not found');
        }
      } else {
        if (!recruiter.company || !questionList.createdBy.company || 
            questionList.createdBy.company.id !== recruiter.company.id) {
          throw new NotFoundException('Question list not found');
        }
      }

      const questions = await this.questionRepository.findBy({
        id: In(questionIds),
      });

      if (questions.length !== questionIds.length) {
        throw new NotFoundException('Some questions were not found');
      }

      questionList.questions = [...questionList.questions, ...questions];
      await this.questionListRepository.save(questionList);

      this.logger.log(`Added ${questions.length} questions to list ${questionList.title}`);
      return questionList;
    } catch (error) {
      this.logger.error(`Failed to add questions to list: ${error.message}`);
      throw error;
    }
  }

  public async deleteQuestionList(recruiterId: number, listId: number): Promise<void> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      const questionList = await this.questionListRepository.findOne({
        where: { id: listId },
        relations: ['createdBy', 'createdBy.company'],
      });

      if (!questionList) {
        throw new NotFoundException(`Question list with ID ${listId} not found`);
      }

      if (recruiter.role === RecruiterRole.FREELANCER) {
        if (questionList.createdBy.id !== recruiterId) {
          throw new NotFoundException('Question list not found');
        }
      } else {
        if (!recruiter.company || !questionList.createdBy.company || 
            questionList.createdBy.company.id !== recruiter.company.id) {
          throw new NotFoundException('Question list not found');
        }
      }

      await this.questionListRepository.remove(questionList);

      this.logger.log(`Deleted question list: ${questionList.title}`);
    } catch (error) {
      this.logger.error(`Failed to delete question list: ${error.message}`);
      throw error;
    }
  }

  public async getLists(
    recruiterId: number,
    query: GetQuestionListsDto,
  ): Promise<PaginatedResponse<QuestionListEntity>> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      if (recruiter.role !== RecruiterRole.FREELANCER && !recruiter.company) {
        throw new NotFoundException('Company not found');
      }

      return this.questionListRepository.getListsWithFilters(
        recruiterId,
        recruiter.role,
        recruiter.company?.id || null,
        query,
      );
    } catch (error) {
      this.logger.error(`Failed to get question lists: ${error.message}`);
      throw error;
    }
  }

  public async getListQuestions(
    recruiterId: number,
    listId: number,
    query: PaginationDto,
  ): Promise<PaginatedResponse<QuestionEntity>> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      const questionList = await this.questionListRepository.findOne({
        where: { id: listId },
        relations: ['createdBy', 'createdBy.company'],
      });

      if (!questionList) {
        throw new NotFoundException(`Question list with ID ${listId} not found`);
      }

      if (recruiter.role === RecruiterRole.FREELANCER) {
        if (questionList.createdBy.id !== recruiterId) {
          throw new NotFoundException('Question list not found');
        }
      } else {
        if (!recruiter.company || !questionList.createdBy.company || 
            questionList.createdBy.company.id !== recruiter.company.id) {
          throw new NotFoundException('Question list not found');
        }
      }

      return this.questionListRepository.getListQuestionsWithPagination(listId, query);
    } catch (error) {
      this.logger.error(`Failed to get questions from list: ${error.message}`);
      throw error;
    }
  }
}
