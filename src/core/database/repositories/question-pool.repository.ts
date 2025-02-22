import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { QuestionPoolEntity } from '@entities';
import { GetQuestionPoolsDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { PaginatedResponse } from '@interfaces';

@Injectable()
export class QuestionPoolRepository extends Repository<QuestionPoolEntity> {
  constructor(private dataSource: DataSource) {
    super(QuestionPoolEntity, dataSource.createEntityManager());
  }

  public async getPoolsWithFilters(
    recruiterId: number,
    recruiterRole: RecruiterRole,
    companyId: number | null,
    query: GetQuestionPoolsDto,
  ): Promise<PaginatedResponse<QuestionPoolEntity>> {
    const queryBuilder = this.createQueryBuilder('pool')
      .leftJoinAndSelect('pool.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.company', 'company');

    if (recruiterRole === RecruiterRole.FREELANCER) {
      queryBuilder.where('createdBy.id = :recruiterId', { recruiterId });
    } else {
      queryBuilder.where('company.id = :companyId', { companyId });
    }

    if (query.search) {
      queryBuilder.andWhere(
        '(LOWER(pool.title) LIKE LOWER(:search) OR LOWER(pool.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    const total = await queryBuilder.getCount();
    const items = await queryBuilder
      .orderBy('pool.createdAt', 'DESC')
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