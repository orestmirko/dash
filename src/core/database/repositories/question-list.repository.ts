import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuestionListEntity, QuestionEntity } from '@entities';
import { GetQuestionListsDto, PaginationDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { PaginatedResponse } from '@interfaces';

@Injectable()
export class QuestionListRepository extends Repository<QuestionListEntity> {
  constructor(private dataSource: DataSource) {
    super(QuestionListEntity, dataSource.createEntityManager());
  }

  public async getListsWithFilters(
    recruiterId: number,
    recruiterRole: RecruiterRole,
    companyId: number | null,
    query: GetQuestionListsDto,
  ): Promise<PaginatedResponse<QuestionListEntity>> {
    const queryBuilder = this.createQueryBuilder('questionList')
      .select([
        'questionList.id',
        'questionList.title',
        'questionList.description',
        'questionList.createdAt',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'company.id',
        'company.name'
      ])
      .leftJoinAndSelect('questionList.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.company', 'company');

    if (recruiterRole === RecruiterRole.FREELANCER) {
      queryBuilder.where('createdBy.id = :recruiterId', { recruiterId });
    } else {
      queryBuilder.where('company.id = :companyId', { companyId });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(LOWER(questionList.title) LIKE LOWER(:search) OR LOWER(questionList.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` }
      );
    }

    const total = await queryBuilder.getCount();
    const items = await queryBuilder
      .orderBy('questionList.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return {
      items,
      meta: {
        total,
        pages: Math.ceil(total / query.limit),
        currentPage: query.page,
        itemsPerPage: query.limit,
      },
    };
  }

  public async getListQuestionsWithPagination(
    listId: number,
    query: PaginationDto,
  ): Promise<PaginatedResponse<QuestionEntity>> {
    const queryBuilder = this.dataSource
      .getRepository(QuestionEntity)
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.createdBy', 'createdBy')
      .where('question.questionList.id = :listId', { listId });

    const total = await queryBuilder.getCount();
    const items = await queryBuilder
      .orderBy('question.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getMany();

    return {
      items,
      meta: {
        total,
        pages: Math.ceil(total / query.limit),
        currentPage: query.page,
        itemsPerPage: query.limit,
      },
    };
  }
}
