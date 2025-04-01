import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CompanyEntity } from './company.entity';
import { RecruiterRole } from '../../../enums/recruiter-role.enum';
import { PrescreenEntity } from './prescreen.entity';
import { VacancyEntity } from './vacancy.entity';

@Entity('recruiters')
export class RecruiterEntity extends BaseEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  public email: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public lastName: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public passwordHash: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: RecruiterRole,
    nullable: false,
  })
  public role: RecruiterRole;

  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public avatarUrl?: string;

  @ManyToOne(() => CompanyEntity, (company) => company.recruiters, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'company_id' })
  public company: CompanyEntity | null;

  @OneToMany(() => PrescreenEntity, (prescreen) => prescreen.recruiter)
  public prescreens: PrescreenEntity[];

  @ManyToMany(() => VacancyEntity, (vacancy) => vacancy.recruiters)
  public vacancies: VacancyEntity[];
}
