import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lead } from '../../leads/entities/lead.entity';

@Index('UQ_TAG_ORG_NAME', ['organizationId', 'name'], { unique: true })
@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 7, default: '#3B82F6' })
  color: string;

  @ManyToMany(() => Lead, (lead) => lead.tags)
  leads: Lead[];

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
