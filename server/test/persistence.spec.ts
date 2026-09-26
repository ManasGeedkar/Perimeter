import { DataSource } from 'typeorm';
import { databaseConfig } from '../src/database/database.config';
import {
  Jurisdiction,
  Organization,
  OrganizationType,
  User,
  InstrumentModel,
  Instrument,
  InstrumentCategory,
  InstrumentStatus,
  LegalSource,
  LegalDocumentType,
  LegalSourceStatus,
  LegalRuleVersion,
  RuleOperationalStatus,
} from '../src/database/entities';

describe('Database Persistence & Constraint Integrity', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource(databaseConfig);
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('Core Schema Verification', () => {
    it('should have all Phase 1 core tables present in public schema', async () => {
      const result = await dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);

      const tableNames = result.map((r: { table_name: string }) => r.table_name);
      const expectedTables = [
        'jurisdictions',
        'organizations',
        'users',
        'roles',
        'permissions',
        'role_permissions',
        'user_roles',
        'instrument_models',
        'instruments',
        'legal_sources',
        'legal_rule_versions',
        'migrations',
      ];

      for (const expected of expectedTables) {
        expect(tableNames).toContain(expected);
      }
    });
  });

  describe('Basic Entity Persistence & Relations', () => {
    it('should successfully persist and retrieve core domain entities', async () => {
      const jurisdictionRepo = dataSource.getRepository(Jurisdiction);
      const orgRepo = dataSource.getRepository(Organization);
      const userRepo = dataSource.getRepository(User);
      const modelRepo = dataSource.getRepository(InstrumentModel);
      const instrumentRepo = dataSource.getRepository(Instrument);
      const legalSourceRepo = dataSource.getRepository(LegalSource);
      const ruleRepo = dataSource.getRepository(LegalRuleVersion);

      const uniqueSuffix = Date.now().toString();

      // 1. Create Jurisdiction
      const jurisdiction = jurisdictionRepo.create({
        stateCode: 'MH',
        stateName: 'Maharashtra',
        districtCode: `PUN-${uniqueSuffix.slice(-5)}`,
        districtName: 'Pune Metrology District',
        isActive: true,
      });
      await jurisdictionRepo.save(jurisdiction);
      expect(jurisdiction.id).toBeDefined();

      // 2. Create Organization
      const org = orgRepo.create({
        name: `Test Traders Pvt Ltd ${uniqueSuffix}`,
        type: OrganizationType.BUSINESS,
        registrationNumber: `27AAPFU0939L1Z${uniqueSuffix.slice(-1)}`,
        address: '101 Market Yard, Pune, Maharashtra',
        jurisdiction: jurisdiction,
        isActive: true,
      });
      await orgRepo.save(org);
      expect(org.id).toBeDefined();

      // 3. Create User
      const user = userRepo.create({
        email: `trader-${uniqueSuffix}@example.com`,
        fullName: 'Ramesh Patel',
        passwordHash: '$2b$12$e0MYzXy4YwOtestplaceholderhashvalue',
        organization: org,
        isActive: true,
      });
      await userRepo.save(user);
      expect(user.id).toBeDefined();

      // 4. Create Instrument Model
      const model = modelRepo.create({
        modelName: `ScalePro-2026-${uniqueSuffix}`,
        manufacturer: 'Precision Scales India Ltd',
        modelApprovalRef: `TAC-${uniqueSuffix}`,
        accuracyClass: 'Class III',
        maxCapacity: 50.0,
        capacityUnit: 'kg',
        verificationIntervalE: 0.01,
        applicableSchedule: 'Seventh Schedule, Part II',
        isActive: true,
      });
      await modelRepo.save(model);
      expect(model.id).toBeDefined();

      // 5. Create Instrument
      const instrument = instrumentRepo.create({
        passportNumber: `IN-MH-PUN-NAWI-${uniqueSuffix}`,
        isProvisional: false,
        category: InstrumentCategory.WEIGHING,
        instrumentType: 'NON_AUTOMATIC_WEIGHING',
        serialNumber: `SN-9988-${uniqueSuffix}`,
        model: model,
        capacity: 50.0,
        unit: 'kg',
        accuracyClass: 'Class III',
        ownerOrganization: org,
        jurisdiction: jurisdiction,
        currentStatus: InstrumentStatus.REGISTERED,
      });
      await instrumentRepo.save(instrument);
      expect(instrument.id).toBeDefined();

      // 6. Create Legal Source and Rule Version
      const legalSource = legalSourceRepo.create({
        sourceCode: `SRC-TEST-${uniqueSuffix.slice(-5)}`,
        filename: 'The-Legal-Metrology-Act-2009.pdf',
        title: 'The Legal Metrology Act, 2009',
        documentType: LegalDocumentType.ACT,
        notificationNumber: 'Act No. 1 of 2010',
        publicationDate: '2010-01-13',
        status: LegalSourceStatus.ACTIVE,
        pageCount: 32,
      });
      await legalSourceRepo.save(legalSource);
      expect(legalSource.id).toBeDefined();

      const ruleVersion = ruleRepo.create({
        ruleCode: `R-TEST-${uniqueSuffix.slice(-5)}`,
        source: legalSource,
        ruleNumber: 'Section 24',
        instrumentCategory: 'weighing',
        status: RuleOperationalStatus.ACTIVE,
        effectiveFrom: '2011-04-01',
        validityPeriodMonths: 24,
        requirementSummary: 'Mandatory verification and stamping of weight or measure before use in transaction',
      });
      await ruleRepo.save(ruleVersion);
      expect(ruleVersion.id).toBeDefined();

      // Verify Relations Query
      const retrieved = await instrumentRepo.findOne({
        where: { id: instrument.id },
        relations: ['model', 'ownerOrganization', 'jurisdiction'],
      });
      expect(retrieved).not.toBeNull();
      expect(retrieved?.passportNumber).toBe(instrument.passportNumber);
      expect(retrieved?.model?.id).toBe(model.id);
      expect(retrieved?.ownerOrganization?.id).toBe(org.id);
      expect(retrieved?.jurisdiction?.id).toBe(jurisdiction.id);
    });
  });

  describe('Foreign-Key Constraint Enforcement', () => {
    it('should reject inserting an instrument with a non-existent jurisdiction_id', async () => {
      const instrumentRepo = dataSource.getRepository(Instrument);
      const fakeUuid = '00000000-0000-0000-0000-000000000000';

      const invalidInstrument = instrumentRepo.create({
        passportNumber: `INVALID-FK-${Date.now()}`,
        category: InstrumentCategory.WEIGHING,
        instrumentType: 'NON_AUTOMATIC_WEIGHING',
        serialNumber: 'SN-INVALID',
        capacity: 10,
        unit: 'kg',
        accuracyClass: 'Class III',
        jurisdiction: { id: fakeUuid } as Jurisdiction,
      });

      let errorThrown = false;
      try {
        await instrumentRepo.save(invalidInstrument);
      } catch (err: any) {
        errorThrown = true;
        // Postgres foreign_key_violation code is 23503
        expect(err.code === '23503' || err.message.includes('foreign key constraint')).toBe(true);
      }
      expect(errorThrown).toBe(true);
    });

    it('should reject inserting an instrument with a non-existent model_id', async () => {
      const instrumentRepo = dataSource.getRepository(Instrument);
      const fakeUuid = '00000000-0000-0000-0000-000000000000';

      const invalidInstrument = instrumentRepo.create({
        passportNumber: `INVALID-MODEL-${Date.now()}`,
        category: InstrumentCategory.WEIGHING,
        instrumentType: 'NON_AUTOMATIC_WEIGHING',
        serialNumber: 'SN-INVALID-MODEL',
        capacity: 10,
        unit: 'kg',
        accuracyClass: 'Class III',
        model: { id: fakeUuid } as InstrumentModel,
      });

      let errorThrown = false;
      try {
        await instrumentRepo.save(invalidInstrument);
      } catch (err: any) {
        errorThrown = true;
        expect(err.code === '23503' || err.message.includes('foreign key constraint')).toBe(true);
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe('Database Error Handling on Invalid Configuration', () => {
    it('should fail clearly when given invalid connection parameters', async () => {
      const badDataSource = new DataSource({
        type: 'postgres',
        host: '127.0.0.1',
        port: 54399, // Unreachable port
        username: 'non_existent_user',
        password: 'invalid_password',
        database: 'non_existent_db',
        connectTimeoutMS: 1500,
      });

      let connectionFailed = false;
      let errorMessage = '';
      try {
        await badDataSource.initialize();
      } catch (err: any) {
        connectionFailed = true;
        errorMessage = err.message || '';
      }

      expect(connectionFailed).toBe(true);
      expect(errorMessage.length).toBeGreaterThan(0);
    });
  });
});
