import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  Role,
  Permission,
  Jurisdiction,
  Organization,
  User,
  InstrumentModel,
  Instrument,
  LegalSource,
  LegalRuleVersion,
} from './entities/index.js';

dotenvConfig();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'perimeter_db',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [
    Role,
    Permission,
    Jurisdiction,
    Organization,
    User,
    InstrumentModel,
    Instrument,
    LegalSource,
    LegalRuleVersion,
  ],
  migrations: ['dist/database/migrations/*.js'],
  subscribers: [],
};

export default new DataSource(databaseConfig);
