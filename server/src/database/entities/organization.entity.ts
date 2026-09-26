import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Jurisdiction } from './jurisdiction.entity.js';

export enum OrganizationType {
  BUSINESS = 'BUSINESS',
  GATC = 'GATC',
  LMO_OFFICE = 'LMO_OFFICE',
  CONTROLLER_HQ = 'CONTROLLER_HQ',
}

@Entity('organizations')
@Index(['type', 'registrationNumber'])
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: OrganizationType,
    default: OrganizationType.BUSINESS,
  })
  type: OrganizationType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  registrationNumber?: string; // GSTIN, GATC Accreditation ID, or Office Code

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @ManyToOne(() => Jurisdiction, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jurisdiction_id' })
  jurisdiction?: Jurisdiction;

  @Column({ type: 'uuid', nullable: true })
  jurisdiction_id?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contactEmail?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  contactPhone?: string;

  @Column({ type: 'jsonb', nullable: true })
  gatcScopeMetadata?: Record<string, unknown>; // Accredited schedule parts and capacity limits

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
