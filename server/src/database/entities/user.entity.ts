import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm';
import { Role } from './role.entity.js';
import { Organization } from './organization.entity.js';
import { Jurisdiction } from './jurisdiction.entity.js';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordHash?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  refreshTokenHash?: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  designation?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index({ unique: true, sparse: true })
  employeeId?: string; // e.g. LMO-MP-4091

  @ManyToOne(() => Organization, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  organization_id?: string;

  @ManyToOne(() => Jurisdiction, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jurisdiction_id' })
  jurisdiction?: Jurisdiction;

  @Column({ type: 'uuid', nullable: true })
  jurisdiction_id?: string;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
