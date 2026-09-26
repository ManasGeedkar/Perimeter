import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('jurisdictions')
@Index(['stateCode', 'districtCode'], { unique: true })
export class Jurisdiction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  stateCode: string; // e.g. "MP", "KA", "DL"

  @Column({ type: 'varchar', length: 100 })
  stateName: string;

  @Column({ type: 'varchar', length: 20 })
  districtCode: string; // e.g. "IND", "BLR"

  @Column({ type: 'varchar', length: 100 })
  districtName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tehsil?: string;

  @Column({ type: 'simple-array', nullable: true })
  pinCodes?: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
