# PERIMETER: Implementation Roadmap & Execution Phases
## Granular Engineering Milestones, Status, Verification Gates & Acceptance Criteria

---

### Document Control
- **Document ID**: PHASES-PERIMETER-2026-V2.0
- **Version**: 2.0.0 (Post-Ingestion & Critical Implementation Audit)
- **Status**: RATIFIED ENGINEERING ROADMAP
- **Target Event**: Smart India Hackathon (SIH) 2026

---

### 1. Concrete Implementation Reality Matrix

> **CRITICAL REALITY PRINCIPLE**: A visual React screen backed by in-memory mock data is **NOT** an implemented feature. A phase is marked `DONE` only when its database entities, backend services, REST APIs, authorization guards, failure paths, automated tests, and UI integration genuinely exist in executable code.

| Phase ID | Phase Name | Status | Real Implementation % | Code / System State |
| :--- | :--- | :---: | :---: | :--- |
| **PHASE 0** | **Documentation, Legal Ingestion & Baseline Audit** | **DONE** | **100% (Docs Only)** | 11 comprehensive specification docs created; 20 legal PDFs ingested; zero code modified. |
| **PHASE 1** | **Backend Foundation & Persistence** | **DONE** | **100% (Infra & Persistence Baseline)** | Backend foundation and persistence infrastructure implemented and tested. (PostgreSQL validated on host; Docker declared; 11/11 automated tests pass). |
| **PHASE 2** | **Authentication, RBAC & Stakeholders** | **DONE** | **100% (Auth & RBAC Baseline)** | Server-side JWT passport auth, bcrypt (work factor 12), refresh token rotation (`jti`), `RolesGuard` (@Roles), 9 core permissions, user status lifecycle, 21/21 e2e tests pass. |
| **PHASE 3** | **Instrument Passport & Identity Registry** | **NOT_STARTED** | **0%** | Persistent DB passport entity, lifecycle tracker `[READY FOR AUTHORIZATION]`. |
| **PHASE 4** | **Legacy Instrument Onboarding** | **NOT_STARTED** | **0%** | Provisional ID DB workflow, photo resolution flow `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 5** | **Application Workflow & Fee Processing** | **NOT_STARTED** | **0%** | Server application entity, fee simulation, Rule 14 UI fix `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 6** | **Scheduling, Assignment & Authority Resolver** | **NOT_STARTED** | **0%** | Scope-based LMO vs GATC assignment algorithm `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 7** | **Legal Rule Repository & Versioning** | **NOT_STARTED** | **0%** | DB seeding of 20 legal sources, temporal rule engine `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 8** | **Rule Resolver & Verification Profile Engine** | **NOT_STARTED** | **0%** | Dynamic profile resolver mapping capacity to test steps `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 9** | **Field Mobile Application (Flutter) Foundation** | **NOT_STARTED** | **0%** | Flutter repo scaffold, offline SQLite, background sync `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 10** | **Guided Inspection Workflow** | **NOT_STARTED** | **0%** | Dynamic inspection runner, consolidate duplicate views `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 11** | **Deterministic MPE & Decision Engine** | **NOT_STARTED** | **0%** | Server-side MPE math engine, unit tests TV-001/002/003 `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 12** | **Evidence Capsule Subsystem** | **NOT_STARTED** | **0%** | MinIO S3 photo upload, genuine GPS telemetry lock `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 13** | **Cryptographic Integrity & Audit Hash Chain** | **NOT_STARTED** | **0%** | RFC 8785 canonical JSON, real SHA-256, hash chain in DB `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 14** | **Certificate Engine & Lifecycle** | **NOT_STARTED** | **0%** | Dynamic 24-month validity calculator per G.S.R. 905(E) `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 15** | **Privacy-Preserving Public QR Verification** | **NOT_STARTED** | **0%** | Public unauthenticated endpoint with PII data masking `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 16** | **Continuous Lifecycle Management** | **NOT_STARTED** | **0%** | Seal break alerts, repair logging, re-verification dispatch `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 17** | **Dispute, Independent Review & Replay** | **NOT_STARTED** | **0%** | Evidence locking, supervisory Verification Replay console `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 18** | **Dashboards, Observability & Notifications** | **NOT_STARTED** | **0%** | Live PostgreSQL metrics, persistent notification queue `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 19** | **Security Hardening, E2E Testing & Audit** | **NOT_STARTED** | **0%** | Automated Playwright/Cypress Golden Demo test suite `[REQUIRES IMPLEMENTATION]`. |
| **PHASE 20** | **Advisory AI & Risk Intelligence** | **DEFERRED** | **0%** | Post-MVP: PyTorch/FastAPI advisory seal anomaly detection `[DEFERRED]`. |

---

### 2. Phase 0 & Phase 1 Validation Gate Summary

- **Phase 0 Deliverables**:
  - 6 Primary Markdown Files: `prd.md`, `architecture.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`.
  - 5 Deep-Dive Docs: `docs/legal-source-index.md`, `docs/traceability.md`, `docs/legal-frontend-conflicts.md`, `docs/decision-log.md`, `docs/risk-register.md`.
  - Forensic Legal Ingestion: 20 PDF documents (1,514 pages) parsed and cataloged.
  - Defect Registry: 18 frontend prototype legal/cryptographic conflicts logged.
  - Zero Code Alteration: Preserved frontend prototype without unauthorized changes.
- **Phase 0 Status**: **DONE (Accepted)**.
- **Phase 1 Deliverables**:
  - `server/` scaffolded as NestJS 11 modular monolith with TypeScript and TypeORM.
  - Docker Compose Infrastructure (`DECLARED / CONFIGURED`): `docker-compose.yml` declaring `postgres:16-alpine` and pinned `minio/minio:RELEASE.2024-11-07T00-52-28Z`.
  - Host PostgreSQL 16 (`USED FOR PHASE 1 VALIDATION`): Running on `127.0.0.1:5432`, data cluster in `d:\Perimeter\.pgdata` (gitignored), database `perimeter_db`.
  - TypeORM configuration with 12 core tables migrated via `InitialCoreSchema1710000000000`.
  - Foreign key constraints, UUID generation, enums, indexes, and timestamps enforced and verified.
  - `GET /api/v1/health` endpoint returning live database connectivity status and service metrics.
  - Automated test suite (11/11 tests passing: 6 persistence/relation/constraint tests + 5 lifecycle/health e2e tests).
  - `.env.example` created; secrets safely excluded in `.gitignore`.
- **MinIO Object Storage Classification**:
  - Infrastructure declared: **YES** (`docker-compose.yml`)
  - Container configuration: **YES** (pinned release)
  - Application integration: **NOT IMPLEMENTED**
  - Evidence upload / retrieval / integrity: **NOT IMPLEMENTED** (planned Phase 12)
- **Known Technical & Documentation Debt**:
  - Docker PostgreSQL reproducibility still needs validation on a container runner.
  - MinIO container is declared but application integration is not implemented (planned Phase 12).
  - Frontend remains primarily mock-backed, but `authService.ts` is explicitly demarcated with `DEMO_MODE` disclaimers and backend integration methods (complete migration in Phase 9).
  - Domain service & API layer is not implemented beyond `/health` and `/auth` (staged progressively).
  - Legal rule execution & MPE calculation are not implemented (planned Phase 7 & 11).
  - Verification & inspection workflow is not implemented (planned Phase 10).
- **Phase 1 Final Status**: **DONE** — *Backend foundation and persistence infrastructure implemented and tested.*
- **Phase 2 Final Status**: **DONE** — *Authentication, RBAC & Stakeholder Identity implemented, migration `1710100000000-AddUserAuthFields` applied, 21/21 e2e tests pass.*
- **Phase 3 Status**: **ON HOLD — Awaiting explicit user confirmation before implementing Instrument Passport & Identity Registry.**

---

### 3. Detailed Phase Specifications (Phases 1 through 20)

*(Phase specifications detailing objectives, dependencies, database changes, API changes, frontend changes, legal dependencies, security considerations, and acceptance criteria remain as defined in [phases.md](file:///d:/Perimeter/phases.md) Version 1.0, with all engineering implementations explicitly marked as `NOT_STARTED` / `0% ACTUALLY IMPLEMENTED`).*
