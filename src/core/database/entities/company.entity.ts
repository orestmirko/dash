import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RecruiterEntity } from './recruiter.entity';
import { VacancyEntity } from './vacancy.entity';
import { CompanySize } from '@enums';

@Entity('companies')
export class CompanyEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  @Index('IDX_COMPANY_NAME')
  public name: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description?: string;

  @Column({
    name: 'website',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public website?: string;

  @Column({
    name: 'linkedin_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public linkedinUrl?: string;

  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public logoUrl?: string;

  @Column({
    name: 'company_size',
    type: 'enum',
    enum: CompanySize,
    nullable: true,
  })
  public companySize?: CompanySize;

  @OneToMany(() => RecruiterEntity, (recruiter) => recruiter.company)
  public recruiters: RecruiterEntity[];

  @OneToMany(() => VacancyEntity, (vacancy) => vacancy.company)
  public vacancies: VacancyEntity[];
}
