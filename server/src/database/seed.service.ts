import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Role,
  Permission,
  Jurisdiction,
  Organization,
  OrganizationType,
  User,
  InstrumentModel,
  LegalSource,
  LegalDocumentType,
  LegalSourceStatus,
  LegalRuleVersion,
  RuleOperationalStatus,
} from './entities/index.js';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
    @InjectRepository(Jurisdiction)
    private readonly jurisdictionRepo: Repository<Jurisdiction>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(InstrumentModel)
    private readonly modelRepo: Repository<InstrumentModel>,
    @InjectRepository(LegalSource)
    private readonly sourceRepo: Repository<LegalSource>,
    @InjectRepository(LegalRuleVersion)
    private readonly ruleRepo: Repository<LegalRuleVersion>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedInitialData();
  }

  async seedInitialData() {
    try {
      this.logger.log('Checking database seed baseline...');

      // 1. Seed Permissions
      const standardPermissions = [
        { code: 'instrument:read', description: 'View instrument passports and technical specifications' },
        { code: 'instrument:create', description: 'Onboard new or legacy instruments' },
        { code: 'instrument:update', description: 'Update instrument physical location and repair history' },
        { code: 'application:read', description: 'View verification applications and scheduling status' },
        { code: 'application:create', description: 'Submit statutory verification applications' },
        { code: 'verification:read', description: 'View verification test records and observation logs' },
        { code: 'verification:perform', description: 'Conduct inspections, record MPE tests, and apply lead seals' },
        { code: 'certificate:read', description: 'View, verify, and download certificates of verification' },
        { code: 'admin:manage', description: 'Supervisory administration, audit hash chain, and jurisdiction setup' },
      ];

      for (const permDef of standardPermissions) {
        try {
          const existing = await this.permRepo.findOne({ where: { code: permDef.code } });
          if (!existing) {
            await this.permRepo.save(permDef);
          }
        } catch {
          // Ignore unique constraint race during concurrent test boot
        }
      }
      this.logger.log('Permissions baseline verified.');

      // Load all permissions for role assignment
      const allPerms = await this.permRepo.find();
      const permMap = new Map(allPerms.map((p) => [p.code, p]));

      // 2. Seed Roles and map permissions
      const roleDefinitions = [
        {
          name: 'ADMIN',
          description: 'Central / State Controller of Legal Metrology',
          permCodes: [
            'instrument:read',
            'instrument:create',
            'instrument:update',
            'application:read',
            'application:create',
            'verification:read',
            'verification:perform',
            'certificate:read',
            'admin:manage',
          ],
        },
        {
          name: 'LMO',
          description: 'Field Legal Metrology Officer (Inspector)',
          permCodes: [
            'instrument:read',
            'application:read',
            'verification:read',
            'verification:perform',
            'certificate:read',
          ],
        },
        {
          name: 'GATC',
          description: 'Government Approved Test Centre Laboratory Officer',
          permCodes: [
            'instrument:read',
            'application:read',
            'verification:read',
            'verification:perform',
            'certificate:read',
          ],
        },
        {
          name: 'BUSINESS',
          description: 'Commercial Weight / Measure Instrument Owner (Trader / Manufacturer)',
          permCodes: [
            'instrument:read',
            'instrument:create',
            'instrument:update',
            'application:read',
            'application:create',
            'certificate:read',
          ],
        },
        {
          name: 'PUBLIC',
          description: 'Citizen / Public Verification Consumer',
          permCodes: ['instrument:read', 'certificate:read'],
        },
      ];

      for (const rDef of roleDefinitions) {
        let role = await this.roleRepo.findOne({
          where: { name: rDef.name },
          relations: ['permissions'],
        });
        const assignedPerms = rDef.permCodes
          .map((code) => permMap.get(code))
          .filter((p): p is Permission => !!p);

        if (!role) {
          role = this.roleRepo.create({
            name: rDef.name,
            description: rDef.description,
            permissions: assignedPerms,
          });
          await this.roleRepo.save(role);
        } else if (!role.permissions || role.permissions.length === 0) {
          role.permissions = assignedPerms;
          await this.roleRepo.save(role);
        }
      }
      this.logger.log('Seeded and linked 5 core system roles with permissions');

      // 2. Seed Primary Jurisdiction (Indore, Madhya Pradesh)
      let jurisdiction = await this.jurisdictionRepo.findOne({
        where: { stateCode: 'MP', districtCode: 'IND' },
      });
      if (!jurisdiction) {
        jurisdiction = await this.jurisdictionRepo.save({
          stateCode: 'MP',
          stateName: 'Madhya Pradesh',
          districtCode: 'IND',
          districtName: 'Indore',
          tehsil: 'Indore Central',
          pinCodes: ['452001', '452002', '452003', '452010'],
          isActive: true,
        });
        this.logger.log('Seeded primary jurisdiction (MP-IND)');
      }

      // 3. Seed Organizations
      const orgCount = await this.orgRepo.count();
      if (orgCount === 0 && jurisdiction) {
        await this.orgRepo.save([
          {
            name: 'Legal Metrology Circle Office, Indore',
            type: OrganizationType.LMO_OFFICE,
            registrationNumber: 'LMO-OFF-MP-IND-01',
            address: 'Collectorate Compound, Indore, MP 452001',
            jurisdiction_id: jurisdiction.id,
            contactEmail: 'lmo.indore@legalmetrology.gov.in',
            contactPhone: '+91-731-2520011',
          },
          {
            name: 'Indore Central Metrology Lab (GATC-01)',
            type: OrganizationType.GATC,
            registrationNumber: 'GATC-MP-2022-004',
            address: 'Sector B, Industrial Area, Sanwer Road, Indore, MP',
            jurisdiction_id: jurisdiction.id,
            contactEmail: 'indorelab@gatc-standards.gov.in',
            gatcScopeMetadata: {
              accreditedSchedules: ['Seventh Schedule (Part I, II)', 'Eighth Schedule (Part VII-A)'],
              maxCapacityKg: 50.0,
            },
          },
          {
            name: 'Shree Ganesh Agro Mills',
            type: OrganizationType.BUSINESS,
            registrationNumber: '23AABCG1234F1Z5',
            address: '42 Mandi Road, Sanyogitaganj, Indore, MP 452001',
            jurisdiction_id: jurisdiction.id,
            contactEmail: 'shreeganeshagro@indoregrain.in',
            contactPhone: '+91-98260-12345',
          },
        ]);
        this.logger.log('Seeded 3 core organizations (LMO Office, GATC, Business)');
      }

      // 4. Seed Legal Sources (20 Ingested Documents Metadata)
      const sourceCount = await this.sourceRepo.count();
      if (sourceCount === 0) {
        await this.sourceRepo.save([
          {
            sourceCode: 'SRC-01',
            filename: 'Legal Metrology act,2009.pdf',
            title: 'The Legal Metrology Act, 2009 (As on 7th May, 2026)',
            documentType: LegalDocumentType.ACT,
            notificationNumber: 'Act No. 1 of 2010',
            publicationDate: '2010-01-13',
            effectiveDate: '2011-04-01',
            status: LegalSourceStatus.ACTIVE,
            pageCount: 21,
            isScanned: false,
            description: 'Principal Parliamentary Act with Jan Vishwas amendments.',
          },
          {
            sourceCode: 'SRC-02',
            filename: '6_0_1732709495.pdf',
            title: 'Legal Metrology (General) Rules, 2011',
            documentType: LegalDocumentType.RULES,
            notificationNumber: 'G.S.R. 71(E)',
            publicationDate: '2011-02-07',
            effectiveDate: '2011-04-01',
            status: LegalSourceStatus.ACTIVE,
            pageCount: 655,
            isScanned: true,
            description: 'Core Central Subordinate Legislation, Schedules I-XIII.',
          },
          {
            sourceCode: 'SRC-15',
            filename: '2025.12.18 Gen Rules 7th Amendment 2 yr verification period_1766504014.pdf',
            title: 'Legal Metrology (General) Seventh Amendment Rules, 2025',
            documentType: LegalDocumentType.AMENDMENT,
            notificationNumber: 'G.S.R. 905(E)',
            publicationDate: '2025-12-18',
            effectiveDate: '2025-12-18',
            status: LegalSourceStatus.ACTIVE,
            pageCount: 2,
            isScanned: false,
            description: 'Substitutes Rule 27(2)(a) with 24-month verification period.',
          },
          {
            sourceCode: 'SRC-19',
            filename: 'Gen_Rules_4th_Amendment_NAWI_Fees_1783336378.pdf',
            title: 'Legal Metrology (General) Fourth Amendment Rules, 2026',
            documentType: LegalDocumentType.AMENDMENT,
            notificationNumber: 'G.S.R. 568(E)',
            publicationDate: '2026-07-03',
            effectiveDate: '2026-07-03',
            status: LegalSourceStatus.ACTIVE,
            pageCount: 3,
            isScanned: false,
            description: 'NAWI standard weight substitution & Twelfth Schedule fees.',
          },
          {
            sourceCode: 'SRC-20',
            filename: 'LM_Gen_Rules_Energy_Meters_1789967396.pdf',
            title: 'Legal Metrology (General) Fifth Amendment Rules, 2026',
            documentType: LegalDocumentType.AMENDMENT,
            notificationNumber: 'G.S.R. 809(E)',
            publicationDate: '2026-09-15',
            effectiveDate: '2027-04-01',
            status: LegalSourceStatus.FUTURE,
            pageCount: 154,
            isScanned: false,
            description: 'Active Electrical Energy Meters (Staged as FUTURE).',
          },
        ]);
        this.logger.log('Seeded key Legal Sources metadata');
      }

      // 5. Seed Golden Demo Instrument Model
      const modelCount = await this.modelRepo.count();
      if (modelCount === 0) {
        await this.modelRepo.save({
          modelName: 'Mechanical Counter Scale 30KG-C3',
          manufacturer: 'Avery Weigh-Tronix India / National Scale Works',
          modelApprovalRef: 'IND/09/2021/184-NAWI',
          approvalDate: '2021-08-15',
          accuracyClass: 'Class III (Medium)',
          maxCapacity: 30.0,
          capacityUnit: 'kg',
          verificationIntervalE: 0.005,
          actualIntervalD: 0.005,
          applicableSchedule: 'Seventh Schedule, Part II',
          isActive: true,
        });
        this.logger.log('Seeded Golden Demo 30kg Mechanical Scale Model');
      }

      this.logger.log('Database seed check completed successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Database seeding failed: ${msg}`);
    }
  }
}
