import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum LegalDocumentType {
  ACT = 'ACT',
  RULES = 'RULES',
  AMENDMENT = 'AMENDMENT',
  CORRIGENDUM = 'CORRIGENDUM',
}

export enum LegalSourceStatus {
  ACTIVE = 'ACTIVE',
  FUTURE = 'FUTURE',
  SUPERSEDED = 'SUPERSEDED',
  CORRIGENDUM = 'CORRIGENDUM',
  OMITTED = 'OMITTED',
}

@Entity('legal_sources')
export class LegalSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  sourceCode: string; // e.g. SRC-01 to SRC-20

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 300 })
  title: string;

  @Column({
    type: 'enum',
    enum: LegalDocumentType,
    default: LegalDocumentType.AMENDMENT,
  })
  documentType: LegalDocumentType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  notificationNumber?: string; // e.g. G.S.R. 905(E)

  @Column({ type: 'date', nullable: true })
  publicationDate?: string;

  @Column({ type: 'date', nullable: true })
  effectiveDate?: string;

  @Column({
    type: 'enum',
    enum: LegalSourceStatus,
    default: LegalSourceStatus.ACTIVE,
  })
  status: LegalSourceStatus;

  @Column({ type: 'integer', default: 1 })
  pageCount: number;

  @Column({ type: 'boolean', default: false })
  isScanned: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
