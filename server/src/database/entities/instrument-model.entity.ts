import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('instrument_models')
export class InstrumentModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  modelName: string;

  @Column({ type: 'varchar', length: 150 })
  manufacturer: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index({ unique: true, sparse: true })
  modelApprovalRef?: string; // Statutory Model Approval Reference under Model Approval Rules, 2011

  @Column({ type: 'date', nullable: true })
  approvalDate?: string;

  @Column({ type: 'varchar', length: 50 })
  accuracyClass: string; // e.g. Class I, Class II, Class III, Class IIII

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  maxCapacity: number;

  @Column({ type: 'varchar', length: 20 })
  capacityUnit: string; // kg, g, mg, L, m, etc.

  @Column({ type: 'decimal', precision: 12, scale: 6, nullable: true })
  verificationIntervalE?: number;

  @Column({ type: 'decimal', precision: 12, scale: 6, nullable: true })
  actualIntervalD?: number;

  @Column({ type: 'varchar', length: 100, default: 'Seventh Schedule' })
  applicableSchedule: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
