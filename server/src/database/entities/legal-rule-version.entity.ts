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
import { LegalSource } from './legal-source.entity.js';

export enum RuleOperationalStatus {
  ACTIVE = 'ACTIVE',
  FUTURE = 'FUTURE',
  SUPERSEDED = 'SUPERSEDED',
  OMITTED = 'OMITTED',
}

@Entity('legal_rule_versions')
export class LegalRuleVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  ruleCode: string; // e.g. R-GEN-027-2025, R-SCH7-P2-NAWI

  @ManyToOne(() => LegalSource, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'source_id' })
  source?: LegalSource;

  @Column({ type: 'uuid', nullable: true })
  source_id?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ruleNumber?: string; // e.g. Rule 27(2)(a), Section 24

  @Column({ type: 'varchar', length: 100, nullable: true })
  scheduleNumber?: string; // Seventh Schedule, Eighth Schedule, Ninth Schedule

  @Column({ type: 'varchar', length: 100, nullable: true })
  partNumber?: string; // Part I, Part II, Part XI

  @Column({ type: 'varchar', length: 100, default: 'weighing' })
  instrumentCategory: string;

  @Column({
    type: 'enum',
    enum: RuleOperationalStatus,
    default: RuleOperationalStatus.ACTIVE,
  })
  status: RuleOperationalStatus;

  @Column({ type: 'date' })
  effectiveFrom: string;

  @Column({ type: 'date', nullable: true })
  effectiveUntil?: string;

  @Column({ type: 'integer', nullable: true })
  validityPeriodMonths?: number; // e.g. 24 for 2025 7th Amendment, 12 for annual

  @Column({ type: 'text' })
  requirementSummary: string;

  @Column({ type: 'jsonb', nullable: true })
  mpeFormulaSpec?: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
