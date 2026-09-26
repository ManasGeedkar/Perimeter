# PERIMETER Database Migrations

This directory tracks the migrations applied to the PERIMETER PostgreSQL database.

## Migrations History
- `1710000000000-InitialCoreSchema.ts`: Initial core schema (Phase 1)
- `1710100000000-AddUserAuthFields.ts`: Authentication & RBAC fields (Phase 2)

TypeORM migration files are executed via `server/src/database/run-migrations.ts`.
