import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { JobStatus, JobType, SeniorityLevel, WorkLocation } from 'src/enums/job.enum';
import { CompanyEntity } from './company.entity';
import { RecruiterEntity } from './recruiter.entity';
import { MinLength, MaxLength, Min } from 'class-validator';

@Entity('vacancies')
export class VacancyEntity extends BaseEntity {
  @Column({ length: 250, nullable: false })
  @MinLength(2)
  @MaxLength(250)
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index('IDX_VACANCY_STATUS')
  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT,
  })
  status: JobStatus;

  @Column({
    type: 'enum',
    enum: JobType,
    nullable: true,
  })
  jobType?: JobType;

  @Column({
    type: 'enum',
    enum: SeniorityLevel,
    nullable: true,
  })
  seniority?: SeniorityLevel;

  @Column({
    type: 'enum',
    enum: WorkLocation,
    nullable: true,
  })
  locationType?: WorkLocation;

  @Column({ length: 100, nullable: true })
  location?: string;

  @Column({ nullable: true })
  @Min(0)
  salaryFrom?: number;

  @Column({ nullable: true })
  @Min(0)
  salaryTo?: number;

  @Column({ length: 10, nullable: true })
  currency?: string;

  @Column('text', { array: true, nullable: true })
  responsibilities?: string[];

  @Column('text', { array: true, nullable: true })
  requirements?: string[];

  @Column('text', { array: true, nullable: true })
  skills?: string[];

  @Column({ type: 'boolean', default: false })
  isHot: boolean;

  @Column({ nullable: true })
  experienceYears?: number;

  @ManyToOne(() => CompanyEntity, (company) => company.vacancies, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'company_id' })
  company: CompanyEntity;

  @ManyToMany(() => RecruiterEntity, (recruiter) => recruiter.vacancies)
  @JoinTable({
    name: 'vacancy_recruiters',
    joinColumn: { name: 'vacancy_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recruiter_id', referencedColumnName: 'id' },
  })
  recruiters: RecruiterEntity[];

  @Column('jsonb', { nullable: true })
  additionalMaterials?: Array<{
    title: string;
    description?: string;
    url: string;
  }>;
}
