import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { VacancyEntity } from '@entities';
import { GetVacanciesDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { PaginatedResponse } from '@interfaces';

@Injectable()
export class VacancyRepository extends Repository<VacancyEntity> {
  constructor(private dataSource: DataSource) {
    super(VacancyEntity, dataSource.createEntityManager());
  }

  public async getVacanciesWithFilters(
    recruiterId: number,
    recruiterRole: RecruiterRole,
    companyId: number | null,
    query: GetVacanciesDto,
  ): Promise<PaginatedResponse<VacancyEntity>> {
    const queryBuilder = this.createQueryBuilder('vacancy')
      .leftJoinAndSelect('vacancy.company', 'company');

    if (recruiterRole === RecruiterRole.FREELANCER) {
      queryBuilder
        .leftJoinAndSelect('vacancy.recruiters', 'recruiters')
        .where('recruiters.id = :recruiterId', { recruiterId });
    } else {
      queryBuilder.where('vacancy.company.id = :companyId', { companyId });
    }

    if (query.status) {
      queryBuilder.andWhere('vacancy.status = :status', { status: query.status });
    }
    if (query.jobType) {
      queryBuilder.andWhere('vacancy.jobType = :jobType', { jobType: query.jobType });
    }
    if (query.seniority) {
      queryBuilder.andWhere('vacancy.seniority = :seniority', { seniority: query.seniority });
    }
    if (query.locationType) {
      queryBuilder.andWhere('vacancy.locationType = :locationType', { locationType: query.locationType });
    }
    if (query.isHot !== undefined) {
      queryBuilder.andWhere('vacancy.isHot = :isHot', { isHot: query.isHot });
    }
    if (query.skills?.length) {
      queryBuilder.andWhere('vacancy.skills && :skills', { skills: query.skills });
    }
    if (query.search) {
      queryBuilder.andWhere(
        '(LOWER(vacancy.title) LIKE LOWER(:search) OR LOWER(vacancy.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }
    if (query.salaryFrom !== undefined) {
      queryBuilder.andWhere('vacancy.salaryTo >= :salaryFrom', { 
        salaryFrom: query.salaryFrom 
      });
    }
    if (query.salaryTo !== undefined) {
      queryBuilder.andWhere('vacancy.salaryFrom <= :salaryTo', { 
        salaryTo: query.salaryTo 
      });
    }

    const total = await queryBuilder.getCount();
    const items = await queryBuilder
      .orderBy('vacancy.createdAt', 'DESC')
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
      }
    };
  }
} 