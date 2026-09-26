import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';
import { InitialCoreSchema1710000000000 } from './migrations/1710000000000-InitialCoreSchema';
import { AddUserAuthFields1710100000000 } from './migrations/1710100000000-AddUserAuthFields';

const dataSource = new DataSource({
  ...databaseConfig,
  migrations: [InitialCoreSchema1710000000000, AddUserAuthFields1710100000000],
});

async function run() {
  console.log('Connecting to PostgreSQL database for migration...');
  await dataSource.initialize();
  console.log('Connected. Running migrations...');
  const migrations = await dataSource.runMigrations();
  console.log(
    `Successfully executed ${migrations.length} migration(s):`,
    migrations.map((m) => m.name),
  );
  await dataSource.destroy();
  console.log('Migration runner finished cleanly.');
}

run().catch((err) => {
  console.error('Migration execution failed:', err);
  process.exit(1);
});
