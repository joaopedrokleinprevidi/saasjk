import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('UQ_LEAD_ORG_PHONE', ['organizationId', 'phone'], { unique: true })
@Index('UQ_LEAD_ORG_EMAIL', ['organizationId', 'email'], { unique: true })
@Index('UQ_LEAD_ORG_NAME', ['organizationId', 'name'], { unique: true })
@Entity('lead')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({type: 'varchar', length: 500 })
  address: string;

  // @ManyToOne(() => Tags)
  // @JoinColumn({name: 'tags'})
  // tags: string[];

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
