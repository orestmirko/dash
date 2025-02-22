import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { QuestionPoolEntity } from './question-pool.entity';
import { QuestionType } from '../../../enums';
import { QuestionListEntity } from './question-list.entity';
import { CompanyEntity } from './company.entity';
import { RecruiterEntity } from './recruiter.entity';

@Entity('questions')
export class QuestionEntity extends BaseEntity {
  @Column({
    name: 'type',
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.TEXT,
    nullable: false,
  })
  public type: QuestionType;

  @Column({
    name: 'text',
    type: 'text',
    nullable: false,
  })
  public text: string;

  @Column({
    name: 'is_required',
    type: 'boolean',
    default: false,
  })
  public isRequired: boolean;

  @ManyToOne(() => CompanyEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'company_id' })
  company?: CompanyEntity;

  @ManyToOne(() => RecruiterEntity, { onDelete: 'SET NULL', nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: RecruiterEntity;

  @ManyToOne(() => QuestionListEntity, (list) => list.questions)
  @JoinColumn({ name: 'question_list_id' })
  public questionList: QuestionListEntity;

  @ManyToOne(() => QuestionPoolEntity, (pool) => pool.questions)
  @JoinColumn({ name: 'question_pool_id' })
  public questionPool: QuestionPoolEntity;
}
