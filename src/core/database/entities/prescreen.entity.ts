import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RecruiterEntity } from './recruiter.entity';
import { PrescreenStatus } from '../../../enums/prescreen-status.enum';

@Entity('prescreens')
export class PrescreenEntity extends BaseEntity {
  @Column({
    name: 'candidate_email',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public candidateEmail: string;

  @Column({
    name: 'candidate_first_name',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public candidateFirstName: string;

  @Column({
    name: 'candidate_last_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public candidateLastName?: string;

  @Column({
    name: 'token',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  public token: string;

  @Column({
    name: 'expires_at',
    type: 'timestamptz',
    nullable: false,
  })
  public expiresAt: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PrescreenStatus,
    default: PrescreenStatus.NOT_STARTED,
  })
  public status: PrescreenStatus;

  @ManyToOne(() => RecruiterEntity, (recruiter) => recruiter.prescreens)
  @JoinColumn({ name: 'recruiter_id' })
  public recruiter: RecruiterEntity;
}
