# PERIMETER
## Legal Metrology Digital Trust & Verification Lifecycle Platform

PERIMETER is a high-integrity verification lifecycle platform for Legal Metrology in India, developed for the Smart India Hackathon (SIH 2026). It establishes an unbroken digital trust chain connecting Businesses/Dealers, Legal Metrology Officers (LMOs), Government Approved Test Centres (GATCs), Regulators, and Citizens.

---

## Architecture Overview

PERIMETER is engineered as a clean, modular monolith backend paired with modern client interfaces:
- **Backend**: NestJS 11 LTS + TypeScript + TypeORM (`server/`)
- **Database**: PostgreSQL 16 (`perimeter_db`)
- **Web Frontend**: React 18 + TypeScript + Vite (Prototype UI in `src/`)
- **Container Infrastructure**: Docker Compose (`docker-compose.yml`)
- **Testing**: Vitest with `unplugin-swc` (Unit, Integration & E2E)

---

## Repository Structure

```
Perimeter/
├── docker-compose.yml              # Local PostgreSQL 16 + MinIO containers
├── package.json                    # Frontend package configuration
├── src/                            # React Web Application (Prototype UI)
│   ├── components/                 # UI components
│   ├── services/                   # Frontend mock services (to be connected in Phase 9)
│   └── ...
├── server/                         # NestJS Backend Modular Monolith
│   ├── src/
│   │   ├── app.module.ts           # Root application module
│   │   ├── main.ts                 # Application entry point (/api/v1 prefix, CORS)
│   │   ├── health/                 # Health check endpoint (GET /api/v1/health)
│   │   └── database/               # Database connection, entities, migrations, seed
│   │       ├── database.config.ts  # TypeORM PostgreSQL configuration
│   │       ├── database.module.ts  # NestJS TypeORM root module
│   │       ├── run-migrations.ts   # Standalone migration executor
│   │       ├── seed.service.ts     # Baseline system seed service
│   │       ├── entities/           # TypeORM Domain Entities
│   │       │   ├── user.entity.ts
│   │       │   ├── role.entity.ts
│   │       │   ├── jurisdiction.entity.ts
│   │       │   ├── organization.entity.ts
│   │       │   ├── instrument.entity.ts
│   │       │   ├── instrument-model.entity.ts
│   │       │   ├── legal-source.entity.ts
│   │       │   └── legal-rule-version.entity.ts
│   │       └── migrations/         # Idempotent database migrations
│   ├── test/                       # Automated backend tests
│   │   ├── health.e2e-spec.ts      # Health & app lifecycle E2E tests
│   │   └── persistence.spec.ts     # PostgreSQL persistence, relations & constraints
│   ├── .env.example                # Example environment variables (No secrets)
│   └── package.json                # Backend dependencies and scripts
├── docs/                           # Architectural, Legal & Decision Records
│   ├── legal-source-index.md       # Ingestion index of 20 statutory legal PDFs
│   ├── legal-frontend-conflicts.md # 18-point defect & conflict register
│   ├── decision-log.md             # ADRs & LDRs (DEC-001 through DEC-010)
│   ├── risk-register.md            # Master risk matrix & mitigations
│   └── traceability.md             # End-to-end statutory traceability matrix
├── rules.md                        # Master Legal Metrology Rulebook (V2.0)
├── architecture.md                 # System Architecture & Technical Specification
├── phases.md                       # Granular Engineering Roadmap
└── memory.md                       # Living Project Memory & Status
```

---

## Local Development Setup

### 1. Prerequisites
- **Node.js**: v20+ or v24 LTS
- **PostgreSQL**: v16+ (Local service or Docker)
- **Docker & Docker Compose** (Optional, for containerized DB)

### 2. Database & Infrastructure Environment

#### Docker Compose Infrastructure (DECLARED / CONFIGURED)
`docker-compose.yml` declares containerized services for staging and production:
- **PostgreSQL 16 Alpine**: `postgres:16-alpine`
- **MinIO Object Storage**: `minio/minio:RELEASE.2024-11-07T00-52-28Z` (pinned release)

```bash
docker compose up -d
```

#### Host PostgreSQL 16 (USED FOR PHASE 1 VALIDATION)
During Phase 1 engineering, automated persistence tests, migration runs, and health checks were validated against a **host PostgreSQL 16 instance**:
- **Host Address**: `127.0.0.1:5432`
- **Cluster Data Directory**: `d:\Perimeter\.pgdata` (safely excluded via `.gitignore`)
- **Database**: `perimeter_db`
- **Owner**: `postgres`

### 3. Backend Setup & Configuration

```bash
cd server
cp .env.example .env
npm install
```

Configure your `.env` file:
```env
PORT=3000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=perimeter_db
CORS_ORIGIN=http://localhost:5173
```

### 4. Run Migrations

```bash
cd server
npm run build
node dist/database/run-migrations.js
```

### 5. Run Automated Tests

Execute unit and persistence integration tests (validates DB connection, entity relations, foreign-key constraint enforcement, and invalid config failure handling):
```bash
cd server
npm test
```

Execute E2E health check and security tests:
```bash
cd server
npm run test:e2e
```

### 6. Start the Backend Development Server

```bash
cd server
npm run start:dev
```

The API will be available at `http://localhost:3000/api/v1`.
Verify database connectivity:
```bash
curl http://localhost:3000/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "perimeter-backend",
  "environment": "development",
  "timestamp": "2026-09-26T07:43:37.355Z",
  "uptime": 14,
  "database": "connected",
  "services": {
    "api": {
      "status": "up",
      "latencyMs": 116
    },
    "database": {
      "status": "connected",
      "type": "postgresql",
      "latencyMs": 116
    }
  }
}
```

---

## MinIO Object Storage Status

- **Infrastructure Declared**: **YES** (defined in `docker-compose.yml`)
- **Container Configuration**: **YES** (pinned to `minio/minio:RELEASE.2024-11-07T00-52-28Z`)
- **Application Integration**: **NOT IMPLEMENTED** (planned for Phase 12)
- **Evidence Upload**: **NOT IMPLEMENTED** (planned for Phase 12)
- **Evidence Retrieval**: **NOT IMPLEMENTED** (planned for Phase 12)
- **Object Integrity Workflow**: **NOT IMPLEMENTED** (planned for Phase 12 & 13)

---

## Known Technical & Documentation Debt

The following items are explicitly tracked as planned/deferred technical debt:
1. **Docker PostgreSQL Reproducibility**: Persistence was validated on the host PostgreSQL daemon; validation on Docker container runners is pending CI/staging host execution.
2. **MinIO Object Storage Integration**: Container is declared but NestJS S3 client and storage service are not implemented (scheduled for Phase 12).
3. **Frontend Integration**: Web client remains primarily backed by in-memory mock services; `authService.ts` explicitly demarcated as `DEMO_MODE` with backend integration methods (complete UI migration scheduled for Phase 9).
4. **Domain Service & API Layer**: REST endpoints beyond `/health` and `/auth` are not implemented (staged progressively in Phases 3–18).
5. **Legal Rule Execution**: Database entities exist, but temporal rule resolution and MPE calculation engines are not implemented (scheduled for Phase 7 & 11).
6. **Verification & Inspection Engine**: Scheduled for Phase 10.
7. **Statutory Authority Resolver**: Software RBAC is implemented; statutory authority under gazetted schedules is distinguished and scheduled for Phase 6.

---

## Phase Status Summary

- **Phase 0 (Documentation & Legal Ingestion)**: **DONE**
- **Phase 1 (Backend Foundation & Persistence)**: **DONE**
- **Phase 2 (Authentication, RBAC & Stakeholders)**: **DONE**
  - NestJS Passport JWT authentication (`JwtAuthGuard`, `@Roles()`, `RolesGuard`).
  - Bcrypt password hashing (work factor 12).
  - Rotated refresh tokens with `jti` replay protection.
  - User status lifecycle (`ACTIVE`, `SUSPENDED`, `DISABLED`, `PENDING`).
  - 9 core permissions seeded and mapped across 5 roles (`ADMIN`, `LMO`, `GATC`, `BUSINESS`, `PUBLIC`).
  - 21/21 E2E tests passing.
- **Phase 3 (Instrument Passport & Identity Registry)**: **ON HOLD — Awaiting explicit user confirmation.**

