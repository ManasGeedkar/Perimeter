import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAuthFields1710100000000 implements MigrationInterface {
  name = 'AddUserAuthFields1710100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create user_status_enum
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'SUSPENDED', 'DISABLED', 'PENDING');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 2. Add status column
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "status" user_status_enum NOT NULL DEFAULT 'ACTIVE';
    `);

    // 3. Add refreshTokenHash column
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "refreshTokenHash" VARCHAR(255);
    `);

    // 4. Add lastLoginAt column
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMPTZ;
    `);

    // 5. Create index on user status
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_status ON users("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_status;`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS "lastLoginAt";`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS "refreshTokenHash";`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS "status";`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_status_enum;`);
  }
}
