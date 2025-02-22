import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity, RecruiterEntity } from '@entities';
import { CreateQuestionDto, UpdateQuestionDto, GetQuestionsDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { PaginatedResponse } from '@interfaces';
import { QuestionRepository } from '@repositories';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: QuestionRepository,

    @InjectRepository(RecruiterEntity)
    private readonly recruiterRepo: Repository<RecruiterEntity>,
  ) {}

  public async createQuestion(recruiterId: number, dto: CreateQuestionDto) {
    const recruiter = await this.recruiterRepo.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });
    if (!recruiter) throw new NotFoundException('Recruiter not found');

    const question = this.questionRepo.create({
      ...dto,
      company: recruiter.role !== RecruiterRole.FREELANCER ? recruiter.company : null,
      createdBy: recruiter,
    });

    return this.questionRepo.save(question);
  }

  public async getAllQuestions(
    recruiterId: number,
    query: GetQuestionsDto,
  ): Promise<PaginatedResponse<QuestionEntity>> {
    const recruiter = await this.recruiterRepo.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });
    if (!recruiter) throw new NotFoundException('Recruiter not found');

    return this.questionRepo.getQuestionsWithFilters(
      recruiterId,
      recruiter.role,
      recruiter.company?.id || null,
      query,
    );
  }

  public async getQuestionById(recruiterId: number, questionId: number) {
    const recruiter = await this.recruiterRepo.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });
    if (!recruiter) throw new NotFoundException('Recruiter not found');

    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['company', 'createdBy'],
    });
    if (!question) throw new NotFoundException('Question not found');

    const hasAccess = 
      question.createdBy.id === recruiterId || 
      (recruiter.company && question.company?.id === recruiter.company.id);

    if (!hasAccess) {
      throw new UnauthorizedException('Invalid question id');
    }

    return question;
  }

  public async updateQuestion(recruiterId: number, questionId: number, dto: UpdateQuestionDto) {
    const question = await this.getQuestionById(recruiterId, questionId);

    if (dto.text !== undefined) question.text = dto.text;
    if (dto.isRequired !== undefined) question.isRequired = dto.isRequired;

    return this.questionRepo.save(question);
  }

  public async deleteQuestion(recruiterId: number, questionId: number) {
    const question = await this.getQuestionById(recruiterId, questionId);
    await this.questionRepo.remove(question);
  }
}
