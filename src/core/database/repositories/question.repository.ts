import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuestionEntity } from '@entities';
import { GetQuestionsDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { PaginatedResponse } from '@interfaces';

@Injectable()
export class QuestionRepository extends Repository<QuestionEntity> {
  constructor(private dataSource: DataSource) {
    super(QuestionEntity, dataSource.createEntityManager());
  }

  public async getQuestionsWithFilters(
    recruiterId: number,
    recruiterRole: RecruiterRole,
    companyId: number | null,
    query: GetQuestionsDto,
  ): Promise<PaginatedResponse<QuestionEntity>> {
    const queryBuilder = this.createQueryBuilder('question')
      .leftJoinAndSelect('question.createdBy', 'createdBy')
      .leftJoinAndSelect('question.company', 'company');

    if (recruiterRole === RecruiterRole.FREELANCER) {
      queryBuilder.where('createdBy.id = :recruiterId', { recruiterId });
    } else {
      queryBuilder.where('company.id = :companyId', { companyId });
    }

    if (query.ids?.length) {
      queryBuilder.andWhere('question.id IN (:...ids)', { ids: query.ids });
    }

    if (query.search) {
      queryBuilder.andWhere('LOWER(question.text) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.type) {
      queryBuilder.andWhere('question.type = :type', { type: query.type });
    }

    if (query.isRequired !== undefined) {
      queryBuilder.andWhere('question.isRequired = :isRequired', {
        isRequired: query.isRequired,
      });
    }

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
