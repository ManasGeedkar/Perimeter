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
import { InstrumentModel } from './instrument-model.entity.js';
import { Organization } from './organization.entity.js';
import { Jurisdiction } from './jurisdiction.entity.js';

export enum InstrumentCategory {
  WEIGHING = 'WEIGHING',
  MEASURING = 'MEASURING',
}

export enum InstrumentStatus {
  REGISTERED = 'REGISTERED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
  IDENTIFICATION_PENDING = 'IDENTIFICATION_PENDING',
}

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  passportNumber: string; // Persistent National Digital Passport Identifier

  @Column({ type: 'boolean', default: false })
  isProvisional: boolean; // Flagged true for legacy instruments

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index({ sparse: true })
  provisionalId?: string; // e.g. TEMP-INST-2026-0042

  @Column({
    type: 'enum',
    enum: InstrumentCategory,
    default: InstrumentCategory.WEIGHING,
  })
  category: InstrumentCategory;

  @Column({ type: 'varchar', length: 100 })
  instrumentType: string; // Counter Machine, Beam Scale, Fuel Dispenser, etc.

  @Column({ type: 'varchar', length: 150 })
  serialNumber: string;

  @ManyToOne(() => InstrumentModel, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'model_id' })
  model?: InstrumentModel;

  @Column({ type: 'uuid', nullable: true })
  model_id?: string;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  capacity: number;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @Column({ type: 'varchar', length: 50 })
  accuracyClass: string;

  @Column({ type: 'decimal', precision: 12, scale: 6, nullable: true })
  verificationIntervalE?: number;

  @Column({ type: 'decimal', precision: 12, scale: 6, nullable: true })
  actualIntervalD?: number;

  @ManyToOne(() => Organization, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_org_id' })
  ownerOrganization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  owner_org_id?: string;

  @ManyToOne(() => Jurisdiction, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jurisdiction_id' })
  jurisdiction?: Jurisdiction;

  @Column({ type: 'uuid', nullable: true })
  jurisdiction_id?: string;

  @Column({
    type: 'enum',
    enum: InstrumentStatus,
    default: InstrumentStatus.REGISTERED,
  })
  currentStatus: InstrumentStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  physicalAddress?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  gpsLatitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  gpsLongitude?: number;

  @Column({ type: 'boolean', default: false })
  isNameplateDamaged: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  nameplatePhotoUri?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  currentLeadSealNumber?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
