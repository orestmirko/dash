import { Injectable, Logger, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { QuestionPoolEntity, QuestionEntity, RecruiterEntity, VacancyEntity } from '@entities';
import { CreateQuestionPoolDto, AddQuestionsToPoolDto, GetQuestionPoolsDto } from '@dtos';
import { QuestionPoolRepository } from '@repositories';
import { PaginatedResponse } from '@interfaces';
import { RecruiterRole } from '@enums';

@Injectable()
export class QuestionPoolService {
  constructor(
    @InjectRepository(QuestionPoolEntity)
    private readonly questionPoolRepository: Repository<QuestionPoolEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(RecruiterEntity)
    private readonly recruiterRepository: Repository<RecruiterEntity>,
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
    @InjectRepository(QuestionPoolRepository)
    private readonly questionPoolRepo: QuestionPoolRepository,
    private readonly logger: Logger,
  ) {}

  public async createQuestionPool(
    recruiterId: number,
    createQuestionPoolDto: CreateQuestionPoolDto,
  ): Promise<QuestionPoolEntity> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      if (createQuestionPoolDto.questionIds?.length > 50) {
        throw new BadRequestException('Question pool cannot contain more than 50 questions');
      }

      const questionPool = this.questionPoolRepository.create({
        title: createQuestionPoolDto.title,
        description: createQuestionPoolDto.description,
        createdBy: { id: recruiterId },
        questions: [],
      });

      if (createQuestionPoolDto.questionIds?.length) {
        const questions = await this.questionRepository.find({
          where: [
            { id: In(createQuestionPoolDto.questionIds), createdBy: { id: recruiterId } },
            { id: In(createQuestionPoolDto.questionIds), company: { id: recruiter.company?.id } }
          ],
          relations: ['createdBy', 'company']
        });

        if (questions.length !== createQuestionPoolDto.questionIds.length) {
          throw new NotFoundException('Some questions were not found');
        }

        questionPool.questions = questions;
      }

      await this.questionPoolRepository.save(questionPool);

      this.logger.log(`Created question pool: ${questionPool.title}`);
      return questionPool;
    } catch (error) {
      this.logger.error(`Failed to create question pool: ${error.message}`);
      throw error;
    }
  }

  public async addQuestionsToPool(
    recruiterId: number,
    poolId: number,
    addQuestionsDto: AddQuestionsToPoolDto,
  ): Promise<QuestionPoolEntity> {
    try {
      const [recruiter, questionPool] = await Promise.all([
        this.recruiterRepository.findOne({
          where: { id: recruiterId },
          relations: ['company'],
        }),
        this.questionPoolRepository.findOne({
          where: { id: poolId },
          relations: ['questions', 'createdBy'],
        }),
      ]);

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      if (!questionPool) {
        throw new NotFoundException(`Question pool with ID ${poolId} not found`);
      }

      if (questionPool.createdBy.id !== recruiterId) {
        throw new UnauthorizedException('You can only modify your own question pools');
      }

      if (questionPool.questions.length + addQuestionsDto.questionIds.length > 50) {
        throw new BadRequestException('Question pool cannot contain more than 50 questions');
      }

      const questions = await this.questionRepository.find({
        where: [
          { id: In(addQuestionsDto.questionIds), createdBy: { id: recruiterId } },
          { id: In(addQuestionsDto.questionIds), company: { id: recruiter.company?.id } }
        ],
        relations: ['createdBy', 'company']
      });

      if (questions.length !== addQuestionsDto.questionIds.length) {
        throw new NotFoundException('Some questions were not found');
      }

      questionPool.questions = [...questionPool.questions, ...questions];
      await this.questionPoolRepository.save(questionPool);

      this.logger.log(`Added ${questions.length} questions to pool: ${questionPool.title}`);
      return questionPool;
    } catch (error) {
      this.logger.error(`Failed to add questions to pool: ${error.message}`);
      throw error;
    }
  }

  public async getQuestionPools(
    recruiterId: number,
    query: GetQuestionPoolsDto,
  ): Promise<PaginatedResponse<QuestionPoolEntity>> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      return this.questionPoolRepo.getPoolsWithFilters(
        recruiterId,
        recruiter.role,
        recruiter.company?.id || null,
        query,
      );
    } catch (error) {
      this.logger.error(`Failed to get question pools: ${error.message}`);
      throw error;
    }
  }

  public async getQuestionPoolById(
    recruiterId: number,
    poolId: number,
  ): Promise<QuestionPoolEntity> {
    try {
      const [recruiter, questionPool] = await Promise.all([
        this.recruiterRepository.findOne({
          where: { id: recruiterId },
          relations: ['company'],
        }),
        this.questionPoolRepository.findOne({
          where: { id: poolId },
          relations: ['questions', 'createdBy', 'createdBy.company'],
        }),
      ]);

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      if (!questionPool) {
        throw new NotFoundException(`Question pool with ID ${poolId} not found`);
      }

      if (recruiter.role === RecruiterRole.FREELANCER) {
        if (questionPool.createdBy.id !== recruiterId) {
          throw new NotFoundException('Question pool not found');
        }
      } else {
        if (!recruiter.company || !questionPool.createdBy.company || 
            questionPool.createdBy.company.id !== recruiter.company.id) {
          throw new NotFoundException('Question pool not found');
        }
      }

      return questionPool;
    } catch (error) {
      this.logger.error(`Failed to get question pool: ${error.message}`);
      throw error;
    }
  }

  public async assignToVacancy(
    recruiterId: number,
    poolId: number,
    vacancyId: number,
  ): Promise<void> {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { id: recruiterId },
        relations: ['company'],
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter not found');
      }

      const questionPool = await this.questionPoolRepository.findOne({
        where: { id: poolId },
        relations: ['createdBy'],
      });

      if (!questionPool) {
        throw new NotFoundException('Question pool not found');
      }

      const vacancy = await this.vacancyRepository.findOne({
        where: { id: vacancyId },
        relations: ['questionPools', 'company'],
      });

      if (!vacancy) {
        throw new NotFoundException('Vacancy not found');
      }

      if (recruiter.role !== RecruiterRole.ADMIN && vacancy.company.id !== recruiter.company?.id) {
        throw new UnauthorizedException('You do not have permission to modify this vacancy');
      }

      if (!vacancy.questionPools) {
        vacancy.questionPools = [];
      }

      if (vacancy.questionPools.some(pool => pool.id === poolId)) {
        throw new BadRequestException('This question pool is already assigned to the vacancy');
      }

      vacancy.questionPools.push(questionPool);
      await this.vacancyRepository.save(vacancy);

      this.logger.log(`Assigned question pool ${poolId} to vacancy ${vacancyId}`);
    } catch (error) {
      this.logger.error(`Failed to assign question pool to vacancy: ${error.message}`);
      throw error;
    }
  }
}
