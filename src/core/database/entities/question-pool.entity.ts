import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RecruiterEntity } from './recruiter.entity';
import { QuestionEntity } from './question.entity';

@Entity('question_pools')
export class QuestionPoolEntity extends BaseEntity {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  //умовна назва пулу питань (наприклад, “Frontend Junior Quiz”).
  public title: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description?: string;

  // (необов’язково) Якщо хочемо зберігати, хто саме створив пул
  @ManyToOne(() => RecruiterEntity, (recruiter) => recruiter.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_recruiter_id' })
  public createdBy?: RecruiterEntity;

  // Зв’язок з таблицею питань: OneToMany – один пул містить багато питань
  @OneToMany(() => QuestionEntity, (question) => question.questionPool, {
    cascade: true, // щоб при збереженні пулу можна було одразу зберегти питання
  })
  public questions: QuestionEntity[];
}
