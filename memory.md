# PERIMETER: Permanent Project Memory & Master State Record
## Living System Memory, Legal Ingestion Baseline, Implementation Reality Audit & Defect Registry

---

### Document Control
- **Document ID**: MEMORY-PERIMETER-2026-V2.1
- **Version**: 2.1.0 (Critical Implementation & Reality Audit)
- **Status**: ACTIVE LIVING MEMORY
- **Current Milestone**: Phase 0 Complete — Reality-Checked Baseline Ratified

---

### 1. Concrete Implementation Reality vs Documentation Plan

| Subsystem | What is ACTUALLY IMPLEMENTED | What is DOCUMENTED / PLANNED | Status / Action Required |
| :--- | :--- | :--- | :--- |
| **Legal Corpus Ingestion** | **20 of 20 legal PDFs** in `legal-sources/` parsed, cataloged, and cross-referenced. | Temporal rule engine architecture & database seed structures. | **VERIFIED FROM SOURCE** |
| **Frontend Presentation** | **25+ React Views** in `src/` (Dashboard, Instruments, Applications, Certificates, Public QR). | Elimination of 18 legal/cryptographic conflicts; backend API binding in Phase 9. | **PROTOTYPE MOCK UI** (7 mock services documented) |
| **Backend API Services** | **Phase 1 Modular Monolith**: NestJS 11 LTS in `server/`, `DatabaseModule`, `HealthModule`, global validation, CORS, `GET /api/v1/health` responding 200 OK. | 14 domain modules (Auth, Verification, Certs, etc.). | **PHASE 1 IMPLEMENTED** (100% Phase 1 Scope) |
| **Database & Persistence** | **Host PostgreSQL 16 (Validated)**: Live on `127.0.0.1:5432`, `perimeter_db`, TypeORM 0.3, 12 core tables migrated. Docker Compose `postgres:16-alpine` is **DECLARED / CONFIGURED**. | Additional verification, evidence, and certificate tables planned for future phases. | **PHASE 1 IMPLEMENTED** (100% Phase 1 Scope) |
| **Object Storage** | **MinIO Declared & Pinned**: `minio/minio:RELEASE.2024-11-07T00-52-28Z` in `docker-compose.yml`. Application integration, evidence upload/retrieval = **0%**. | Evidence capsule subsystem integration in Phase 12. | **INFRASTRUCTURE DECLARED ONLY** |
| **Legal Rule Engine** | **0% Backend Engine Code Written**. Persistence entities `legal_sources` and `legal_rule_versions` exist (`[DATABASE FOUNDATION ONLY]`). | Pure temporal legal rule resolver evaluated by inspection date. | **PLANNED SPEC (Phase 3 & 4)** |
| **MPE Decision Engine** | **0% Backend Code Written**. Static 5-row array in UI. | Pure mathematical server-side calculation engine (TV-001–003). | **PLANNED SPEC (Phase 11)** |
| **Cryptographic Integrity** | **0% Backend Code Written**. Fake `Math.random()` strings in UI. | RFC 8785 canonical JSON serializer, genuine SHA-256 digest, DB hash chain. | **PLANNED SPEC (Phase 13)** |
| **Field Mobile Client** | **0% Code Written**. No Flutter repository exists. | Flutter cross-platform client with offline SQLite persistence. | **PLANNED SPEC (Phase 9)** |
| **Automated Test Suites** | **11 Automated Tests Passing**: 6 persistence/relation/constraint tests (`test/persistence.spec.ts`) + 5 lifecycle/health e2e tests (`test/health.e2e-spec.ts`). | Playwright/Cypress E2E, full verification pipeline tests. | **PHASE 1 IMPLEMENTED** (100% Phase 1 Scope) |

---

### 2. Legal Corpus Ingestion Baseline (Verified Sources)

All 20 PDF documents in `legal-sources/` have been physically verified:
1. **SRC-01**: Legal Metrology Act, 2009 (Updated May 2026 w/ Jan Vishwas Acts).
2. **SRC-02**: Legal Metrology (General) Rules, 2011 (G.S.R. 71(E), 655 Pages, Principal Rules).
3. **SRC-03**: Corrigendum G.S.R. 317(E) (Twelfth Schedule Fees).
4. **SRC-04**: 2012 Amendment G.S.R. 668(E) (Notice Periods in Rules 15, 16, 23).
5. **SRC-05**: 2016 Amendment G.S.R. 875(E) (Weighbridges in Motion, Eighth Schedule Part VIII).
6. **SRC-06**: 2021 Amendment G.S.R. 149(E) (Rule 11 Substitution - Place of Verification).
7. **SRC-07**: 2022 Amendment G.S.R. 763(E) (Rule 29 Company Officer Nomination).
8. **SRC-08**: 2025 Amendment G.S.R. 34(E) (Speed Radar, Eighth Schedule Part X).
9. **SRC-09**: 2025 2nd Amendment G.S.R. 242(E) (Rule 27A & Gas Meters, Eighth Schedule Part XI).
10. **SRC-10**: 2025 Corrigendum (Gas Meters Text Correction).
11. **SRC-11**: 2025 3rd Amendment G.S.R. 498(E) (Automated Sphygmomanometers, Eighth Schedule Part VII-B).
12. **SRC-12**: 2025 4th Amendment G.S.R. 525(E) (Moisture Meters, Eighth Schedule Part XII).
13. **SRC-13**: 2025 5th Amendment G.S.R. 536(E) (Clinical Electrical Thermometers, Eighth Schedule Part VI-C).
14. **SRC-14**: 2025 6th Amendment G.S.R. 875(E) (Evidential Breath Analyzers, Eighth Schedule Part XIII, 237 Pages).
15. **SRC-15**: 2025 7th Amendment G.S.R. 905(E) (Rule 27(2)(a) 24-Month Re-verification Period).
16. **SRC-16**: 2026 Amendment G.S.R. 10(E) (Manual Sphygmomanometers, Eighth Schedule Part VII-A).
17. **SRC-17**: 2026 2nd Amendment G.S.R. 122(E) (Continuous Electrical Thermometers, Eighth Schedule Part VI-D).
18. **SRC-18**: 2026 3rd Amendment G.S.R. 175(E) (Omission of Rules 16, 21, and 21A).
19. **SRC-19**: 2026 4th Amendment G.S.R. 568(E) (NAWI Weight Substitution & Fee Revisions).
20. **SRC-20**: 2026 5th Amendment G.S.R. 809(E) (Active Electrical Energy Meters - **STAGED AS FUTURE, Effective 180 days from 15 Sept 2026**).

---

### 3. Master Documentation Register

The project documentation baseline comprises 11 ratified specification documents:

- [prd.md](file:///d:/Perimeter/prd.md) — Product Requirements Document (V1.0)
- [architecture.md](file:///d:/Perimeter/architecture.md) — System Architecture & Technical Specification (V1.0)
- [rules.md](file:///d:/Perimeter/rules.md) — Legal Metrology Domain Rulebook (V2.0)
- [phases.md](file:///d:/Perimeter/phases.md) — Granular Implementation Roadmap (V2.0)
- [design.md](file:///d:/Perimeter/design.md) — Product & UI/UX Design System Specification (V1.0)
- [memory.md](file:///d:/Perimeter/memory.md) — Living System Memory & Master State Record (V2.1)
- [docs/legal-source-index.md](file:///d:/Perimeter/docs/legal-source-index.md) — 20-PDF Ingestion Index
- [docs/traceability.md](file:///d:/Perimeter/docs/traceability.md) — End-to-End Traceability Matrix (V2.0)
- [docs/legal-frontend-conflicts.md](file:///d:/Perimeter/docs/legal-frontend-conflicts.md) — 18-Point Prototype Defect Register
- [docs/decision-log.md](file:///d:/Perimeter/docs/decision-log.md) — Master Decision Log (ADRs & LDRs)
- [docs/risk-register.md](file:///d:/Perimeter/docs/risk-register.md) — Master Risk Register & Mitigation Strategy

---

### 4. Defect Registry: 18 Frontend Prototype Conflicts Tracked

All 18 conflicts in [docs/legal-frontend-conflicts.md](file:///d:/Perimeter/docs/legal-frontend-conflicts.md) are scheduled for elimination during their assigned implementation phases:
1. `CON-01`: Remove erroneous "(Rule 14)" from generic application modal (`NewApplicationModal.tsx`) $\to$ Phase 5.
2. `CON-02`: Replace hardcoded Rule 14(1) citation in certificates (`en.ts`, `hi.ts`) with dynamic rule resolution $\to$ Phase 14.
3. `CON-03`: Remove fabricated Rule 14 point-of-sale display claim in dashboard $\to$ Phase 18.
4. `CON-04`: Replace hardcoded universal 365-day expiry in `certificateService.ts` with 24-month validity per G.S.R. 905(E) $\to$ Phase 14.
5. `CON-05`: Update landing page copy claiming annual renewal for all scales $\to$ Phase 18.
6. `CON-06`: Remove false Section 24 failure reason alert in `VerificationWorkspacePage.tsx` $\to$ Phase 10.
7. `CON-07`: Discontinue global OIML R-76 citations across non-weighing screens $\to$ Phase 10.
8. `CON-08`: Make inspection workspace subtitles dynamic to schedule part $\to$ Phase 10.
9. `CON-09`: Replace static 5-row observation table with dynamic test profile loader $\to$ Phase 11.
10. `CON-10`: Deprecate and remove redundant `VerificationWorkspacePage.tsx` (669 lines) $\to$ Phase 10.
11. `CON-11`: Eliminate `Math.random()` GPS coordinate simulation $\to$ Phase 12.
12. `CON-12`: Replace fake random SHA-256 string generator with genuine RFC 8785 canonical digest $\to$ Phase 13.
13. `CON-13`: Replace decorative text signatures with structured digital signature container $\to$ Phase 13.
14. `CON-14`: Mask personal trader details (phone, street address) on public QR verification page $\to$ Phase 15.
15. `CON-15`: Restrict client-side role switcher to development demo mode only $\to$ Phase 2.
16. `CON-16`: Replace Unsplash stock imagery with real camera capture and MinIO upload $\to$ Phase 12.
17. `CON-17`: Restrict GATC assignment to verified accredited schedules and capacities $\to$ Phase 6.
18. `CON-18`: Replace hypothetical government API endpoint with local NestJS container target $\to$ Phase 1.

---

### 5. Implementation Gate Status

- **Phase 0 Status**: **DONE (Documentation, Legal Ingestion & Baseline Audit Complete)**.
- **Phase 1 Status**: **DONE** — *Backend foundation and persistence infrastructure implemented and tested.*
  - **Infrastructure Validated**: Host PostgreSQL 16 on `127.0.0.1:5432` (`d:\Perimeter\.pgdata`), database `perimeter_db`.
  - **Infrastructure Declared / Configured**: Docker Compose (`postgres:16-alpine`, `minio/minio:RELEASE.2024-11-07T00-52-28Z`).
  - **Database Migration**: 12 core tables migrated cleanly via `InitialCoreSchema1710000000000`.
  - **Health Endpoint**: `GET /api/v1/health` verified live (HTTP 200, status "ok", database "connected").
  - **Automated Tests**: 11/11 tests passing across integration (`test/persistence.spec.ts`) and E2E (`test/health.e2e-spec.ts`).
- **Phase 2 Status**: **DONE** — *Authentication, RBAC & Stakeholders implemented.*
  - **Auth Endpoints**: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `GET /api/v1/auth/me`.
  - **Security Controls**: Bcrypt work factor 12, JWT stateless access tokens (15m), stateful rotated refresh tokens (7d) with `jti` replay protection, zero secret leakage, safe error responses.
  - **RBAC**: Server-side `JwtAuthGuard`, `@Roles(...)`, and `RolesGuard` supporting `ADMIN`, `LMO`, `GATC`, `BUSINESS`, `PUBLIC`.
  - **Permissions**: 9 core permissions seeded and mapped to roles.
  - **Database Migration**: `1710100000000-AddUserAuthFields` applied (user status enum `ACTIVE`, `SUSPENDED`, `DISABLED`, `PENDING`, `refreshTokenHash`, `lastLoginAt`).
  - **Frontend Boundary**: `src/services/authService.ts` refactored to explicitly demarcate `DEMO_MODE` and provide real backend integration methods.
  - **Automated Tests**: 21/21 E2E tests passing (16 auth E2E tests in `test/auth.e2e-spec.ts` covering `AUTH-001` through `AUTH-009`, `REFRESH-001`, `RBAC-001` through `RBAC-004`, `SEC-001`, `SEC-002`, plus 5 health/app E2E tests).
- **Phase 3 Status**: **ON HOLD — Awaiting explicit user confirmation before scaffolding Instrument Passport & Identity Registry**.
- **Known Technical & Documentation Debt**:
  1. Docker PostgreSQL reproducibility still needs validation on a container runner.
  2. MinIO container is declared/pinned but application integration is not implemented (planned Phase 12).
  3. Frontend remains primarily mock-backed, but `authService.ts` is explicitly demarcated as `DEMO_MODE` with backend integration methods (complete migration in Phase 9).
  4. Domain service/API layer is not implemented beyond `/health` and `/auth`.
  5. Legal rule execution is not implemented (planned Phase 7 & 11).
  6. Verification engine is not implemented (planned Phase 10).
  7. Statutory authority resolver is not implemented (distinguished from software RBAC; planned Phase 6).
- **Code Modification Status**: `server/` with NestJS 11 + TypeORM + Passport + JWT + PostgreSQL; frontend `authService.ts` updated with `DEMO_MODE` markers and backend API methods.
