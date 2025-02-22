import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RecruiterEntity } from './recruiter.entity';
import { QuestionEntity } from './question.entity';

@Entity('question_lists')
export class QuestionListEntity extends BaseEntity {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  public title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description?: string;

  @ManyToOne(() => RecruiterEntity, (recruiter) => recruiter.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_recruiter_id' })
  public createdBy?: RecruiterEntity;

  @OneToMany(() => QuestionEntity, (question) => question.questionList, {
    cascade: true,
  })
  public questions: QuestionEntity[];
}
