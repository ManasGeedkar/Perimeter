import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { SeedService } from './seed.service.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'perimeter_db'),
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
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('DB_LOGGING') === 'true',
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([
      Role,
      Permission,
      Jurisdiction,
      Organization,
      User,
      InstrumentModel,
      Instrument,
      LegalSource,
      LegalRuleVersion,
    ]),
  ],
  providers: [SeedService],
  exports: [TypeOrmModule, SeedService],
})
export class DatabaseModule {}
