import { Column, Entity, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreWorkHoursEntity } from './store-work-hours.entity';
import { ProductEntity } from './product.entity';
import { StoreType } from '../../../enums';

@Entity('stores')
export class StoreEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  @Index()
  public name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public logoUrl: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public mainImageUrl: string;

  @Column({
    type: 'enum',
    enum: StoreType,
    nullable: true,
  })
  public storeType: StoreType;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
  })
  public phone: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  public email: string;

  @Column({
    name: 'website',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  public website: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public street: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Index()
  public city: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @Index()
  public region: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  public latitude: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
  })
  public longitude: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Index()
  public isCityDeliveryAvailable: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Index()
  public isActive: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public instagramUrl: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public tiktokUrl: string;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  public notes: string;

  @OneToMany(() => StoreWorkHoursEntity, (workHours) => workHours.store, { cascade: true })
  public workHours: StoreWorkHoursEntity[];

  @OneToMany(() => ProductEntity, (product) => product.store, { cascade: true })
  public products: ProductEntity[];
}
