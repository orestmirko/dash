import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacancyEntity, RecruiterEntity } from '@entities';
import { updateObjectFields } from '@utils';
import { CreateVacancyDto, UpdateVacancyDto, GetVacanciesDto } from '@dtos';
import { RecruiterRole } from '@enums';
import { PaginatedResponse } from '@interfaces';
import { VacancyRepository } from '@repositories';

@Injectable()
export class VacancyService {
  constructor(
    @InjectRepository(VacancyRepository)
    private readonly vacancyRepo: VacancyRepository,
    @InjectRepository(RecruiterEntity)
    private readonly recruiterRepo: Repository<RecruiterEntity>,
  ) {}

  public async createVacancy(recruiterId: number, dto: CreateVacancyDto): Promise<VacancyEntity> {
    const recruiter = await this.recruiterRepo.findOne({ where: { id: recruiterId } });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    if (!recruiter.company && recruiter.role !== RecruiterRole.FREELANCER) {
      throw new NotFoundException('Recruiter company not found');
    }

    if (dto.salaryFrom !== undefined && dto.salaryTo !== undefined && dto.salaryFrom > dto.salaryTo) {
      throw new BadRequestException('salaryFrom cannot be greater than salaryTo');
    }

    const company = recruiter.role === RecruiterRole.ADMIN ? recruiter.company : null;

    if (dto.additionalMaterials?.length) {
      for (const material of dto.additionalMaterials) {
        if (!material.title || !material.url) {
          throw new BadRequestException('Each additional material must have a title and URL');
        }
      }
    }

    const vacancy = this.vacancyRepo.create({
      ...dto,
      company,
    });

    return this.vacancyRepo.save(vacancy);
  }

  public async getVacancies(
    recruiterId: number,
    query: GetVacanciesDto,
  ): Promise<PaginatedResponse<VacancyEntity>> {
    const recruiter = await this.recruiterRepo.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    if (recruiter.role !== RecruiterRole.FREELANCER && !recruiter.company) {
      throw new NotFoundException('Company not found');
    }

    return this.vacancyRepo.getVacanciesWithFilters(
      recruiterId,
      recruiter.role,
      recruiter.company?.id || null,
      query,
    );
  }

  public async getVacancyById(recruiterId: number, vacancyId: number): Promise<VacancyEntity> {
    const recruiter = await this.recruiterRepo.findOne({
      where: { id: recruiterId },
      relations: ['company'],
    });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }

    const vacancy = await this.vacancyRepo.findOne({
      where: { id: vacancyId },
      relations: ['company', 'recruiters'],
    });
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    if (recruiter.role === RecruiterRole.FREELANCER) {
      const hasAccess = vacancy.recruiters.some(r => r.id === recruiterId);
      if (!hasAccess) {
        throw new UnauthorizedException('Invalid recruiter ID');
      }
      return vacancy;
    }

    if (!recruiter.company) {
      throw new NotFoundException('Company not found');
    }

    if (vacancy.company && vacancy.company.id !== recruiter.company.id) {
      throw new UnauthorizedException('This vacancy does not belong to your company');
    }

    return vacancy;
  }

  public async updateVacancy(
    recruiterId: number,
    vacancyId: number,
    dto: UpdateVacancyDto,
  ): Promise<VacancyEntity> {
    const vacancy = await this.getVacancyById(recruiterId, vacancyId);

    if (dto.salaryFrom !== undefined && dto.salaryTo !== undefined && dto.salaryFrom > dto.salaryTo) {
      throw new BadRequestException('salaryFrom cannot be greater than salaryTo');
    }

    updateObjectFields(vacancy, dto);

    return this.vacancyRepo.save(vacancy);
  }

  public async deleteVacancy(recruiterId: number, vacancyId: number): Promise<void> {
    const vacancy = await this.getVacancyById(recruiterId, vacancyId);
    await this.vacancyRepo.remove(vacancy);
  }
}
