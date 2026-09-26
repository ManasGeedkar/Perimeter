import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialCoreSchema1710000000000 implements MigrationInterface {
  name = 'InitialCoreSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Extensions
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 2. Permissions & Roles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
      );
    `);

    // 3. Jurisdictions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jurisdictions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "stateCode" VARCHAR(10) NOT NULL,
        "stateName" VARCHAR(100) NOT NULL,
        "districtCode" VARCHAR(20) NOT NULL,
        "districtName" VARCHAR(100) NOT NULL,
        tehsil VARCHAR(100),
        "pinCodes" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_jurisdiction_state_dist UNIQUE ("stateCode", "districtCode")
      );
    `);

    // 4. Organizations
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE organization_type_enum AS ENUM ('BUSINESS', 'GATC', 'LMO_OFFICE', 'CONTROLLER_HQ');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        type organization_type_enum NOT NULL DEFAULT 'BUSINESS',
        "registrationNumber" VARCHAR(100),
        address VARCHAR(500),
        jurisdiction_id UUID REFERENCES jurisdictions(id) ON DELETE SET NULL,
        "contactEmail" VARCHAR(150),
        "contactPhone" VARCHAR(30),
        "gatcScopeMetadata" JSONB,
        "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_org_type_reg ON organizations(type, "registrationNumber");
    `);

    // 5. Users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(150) NOT NULL UNIQUE,
        "passwordHash" VARCHAR(255),
        "fullName" VARCHAR(150) NOT NULL,
        phone VARCHAR(30),
        designation VARCHAR(100),
        "employeeId" VARCHAR(100) UNIQUE,
        organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
        jurisdiction_id UUID REFERENCES jurisdictions(id) ON DELETE SET NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
      );
    `);

    // 6. Instrument Models
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS instrument_models (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "modelName" VARCHAR(150) NOT NULL,
        manufacturer VARCHAR(150) NOT NULL,
        "modelApprovalRef" VARCHAR(100) UNIQUE,
        "approvalDate" DATE,
        "accuracyClass" VARCHAR(50) NOT NULL,
        "maxCapacity" NUMERIC(12, 4) NOT NULL,
        "capacityUnit" VARCHAR(20) NOT NULL,
        "verificationIntervalE" NUMERIC(12, 6),
        "actualIntervalD" NUMERIC(12, 6),
        "applicableSchedule" VARCHAR(100) NOT NULL DEFAULT 'Seventh Schedule',
        "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 7. Instruments (Passport)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE instrument_category_enum AS ENUM ('WEIGHING', 'MEASURING');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE instrument_status_enum AS ENUM (
          'REGISTERED', 'PENDING_VERIFICATION', 'VERIFIED',
          'EXPIRING_SOON', 'EXPIRED', 'SUSPENDED', 'IDENTIFICATION_PENDING'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS instruments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "passportNumber" VARCHAR(100) NOT NULL UNIQUE,
        "isProvisional" BOOLEAN NOT NULL DEFAULT FALSE,
        "provisionalId" VARCHAR(100),
        category instrument_category_enum NOT NULL DEFAULT 'WEIGHING',
        "instrumentType" VARCHAR(100) NOT NULL,
        "serialNumber" VARCHAR(150) NOT NULL,
        model_id UUID REFERENCES instrument_models(id) ON DELETE SET NULL,
        capacity NUMERIC(12, 4) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        "accuracyClass" VARCHAR(50) NOT NULL,
        "verificationIntervalE" NUMERIC(12, 6),
        "actualIntervalD" NUMERIC(12, 6),
        owner_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
        jurisdiction_id UUID REFERENCES jurisdictions(id) ON DELETE SET NULL,
        "currentStatus" instrument_status_enum NOT NULL DEFAULT 'REGISTERED',
        "physicalAddress" VARCHAR(500),
        "gpsLatitude" NUMERIC(10, 7),
        "gpsLongitude" NUMERIC(10, 7),
        "isNameplateDamaged" BOOLEAN NOT NULL DEFAULT FALSE,
        "nameplatePhotoUri" VARCHAR(500),
        "currentLeadSealNumber" VARCHAR(100),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_inst_passport ON instruments("passportNumber");
      CREATE INDEX IF NOT EXISTS idx_inst_status ON instruments("currentStatus");
    `);

    // 8. Legal Sources
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE legal_document_type_enum AS ENUM ('ACT', 'RULES', 'AMENDMENT', 'CORRIGENDUM');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE legal_source_status_enum AS ENUM ('ACTIVE', 'FUTURE', 'SUPERSEDED', 'CORRIGENDUM', 'OMITTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS legal_sources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sourceCode" VARCHAR(50) NOT NULL UNIQUE,
        filename VARCHAR(255) NOT NULL,
        title VARCHAR(300) NOT NULL,
        "documentType" legal_document_type_enum NOT NULL DEFAULT 'AMENDMENT',
        "notificationNumber" VARCHAR(100),
        "publicationDate" DATE,
        "effectiveDate" DATE,
        status legal_source_status_enum NOT NULL DEFAULT 'ACTIVE',
        "pageCount" INTEGER NOT NULL DEFAULT 1,
        "isScanned" BOOLEAN NOT NULL DEFAULT FALSE,
        description TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 9. Legal Rule Versions
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE rule_operational_status_enum AS ENUM ('ACTIVE', 'FUTURE', 'SUPERSEDED', 'OMITTED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS legal_rule_versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "ruleCode" VARCHAR(100) NOT NULL UNIQUE,
        source_id UUID REFERENCES legal_sources(id) ON DELETE SET NULL,
        "ruleNumber" VARCHAR(100),
        "scheduleNumber" VARCHAR(100),
        "partNumber" VARCHAR(100),
        "instrumentCategory" VARCHAR(100) NOT NULL DEFAULT 'weighing',
        status rule_operational_status_enum NOT NULL DEFAULT 'ACTIVE',
        "effectiveFrom" DATE NOT NULL,
        "effectiveUntil" DATE,
        "validityPeriodMonths" INTEGER,
        "requirementSummary" TEXT NOT NULL,
        "mpeFormulaSpec" JSONB,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_rule_code ON legal_rule_versions("ruleCode");
      CREATE INDEX IF NOT EXISTS idx_rule_status ON legal_rule_versions(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS legal_rule_versions CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS legal_sources CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS instruments CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS instrument_models CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS organizations CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jurisdictions CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions CASCADE;`);
  }
}
