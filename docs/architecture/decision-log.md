# PERIMETER: Master Decision Log (ADR & LDR)
## Architectural Decision Records (ADR) & Legal Decision Records (LDR)

---

### Document Control
- **Document ID**: DEC-PERIMETER-2026-V1.0
- **Version**: 1.0.0
- **Status**: RATIFIED DECISION LOG
- **Target Event**: Smart India Hackathon (SIH) 2026

---

### 1. Architectural Decision Records (ADR)

#### DEC-001: Modular Monolith Architecture over Distributed Microservices
- **Decision ID**: `DEC-ADR-001`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Evaluating architecture for the PERIMETER backend for SIH 2026 under tight delivery constraints.
- **Decision**: Scaffold a clean, modular NestJS application monolith with strict domain boundaries and dependency injection rather than distributed microservices or message broker topologies.
- **Rationale**:
  1. Guarantees ACID transaction semantics across applications, verifications, and audit hash chains.
  2. Eliminates network serialization overhead, eventual consistency failures, and complex distributed consensus debugging.
  3. Ensures straightforward containerized deployment on any local or staging host using standard `docker-compose.yml`.
- **Consequences**: Future scaling can decompose individual modules (e.g. Public QR verification) if traffic demands, but the core verification and audit core remains cohesive.

#### DEC-002: In-Process RFC 8785 Canonical JSON Serialization & SHA-256 Hashing
- **Decision ID**: `DEC-ADR-002`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Creating tamper-evident verification evidence capsules and certificates.
- **Decision**: Use deterministic in-process RFC 8785 canonical JSON serialization hashed via standard SHA-256, chained sequentially in PostgreSQL (`Hash_n = SHA256(Payload_n + Hash_{n-1})`).
- **Rejected Alternative**: Public or private blockchain ledger (Ethereum, Hyperledger Fabric).
- **Rationale**: Public blockchains introduce financial gas costs, network latency, and public data leakage vulnerabilities. Private enterprise blockchains add substantial DevOps overhead without adding mathematical integrity advantages beyond what an immutable hash chain provides.
- **Consequences**: Zero cloud or transaction costs; sub-millisecond hashing; 100% offline verifiable.

#### DEC-003: Relational PostgreSQL Schema with JSONB Hybrid Flexibility
- **Decision ID**: `DEC-ADR-003`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Modeling core lifecycle entities alongside dynamic, schedule-specific test observations.
- **Decision**: Use PostgreSQL 16 with rigid relational foreign keys for core lifecycle entities (`instruments`, `applications`, `verifications`, `certificates`) and structured `JSONB` columns for dynamic schedule test inputs and MPE parameters.
- **Rationale**: Balances strict referential integrity for statutory compliance with the flexibility needed to support 15+ different instrument schedules (scales, flow meters, radars, breath analyzers) without continuous database migration bloat.

---

### 2. Legal Decision Records (LDR)

#### DEC-004: Versioned Temporal Legal Rule Engine
- **Decision ID**: `DEC-LDR-001`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Resolving MPE tolerances and verification validity periods across multiple gazette amendments.
- **Decision**: Implement all legal rules as versioned database records evaluated strictly against the date of verification. Rules must support states: `ACTIVE`, `FUTURE`, and `SUPERSEDED`.
- **Rationale**: A static database of rules cannot legally replay historical verifications or stage future rules (such as the 2026 Energy Meter amendment) without corrupting active calculations.

#### DEC-005: Enforcement of 2025 Seventh Amendment (24-Month Validity Period)
- **Decision ID**: `DEC-LDR-002`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Existing prototype hardcodes universal 1-year (365 days) certificate validity.
- **Decision**: Overturn all hardcoded 1-year validity assumptions. Implement the 2025 Seventh Amendment (G.S.R. 905(E)), dynamically assigning a 24-month validity period to:
  1. Weights
  2. Capacity measures
  3. Length measures
  4. Tape measures
  5. Beam scales
  6. Counter machines
  7. Fuel dispensers (petrol and diesel)
- **Rationale**: Statutory mandate effective since 18th December, 2025. Universal annual renewal is legally obsolete for these retail categories.

#### DEC-006: Staging of 2026 Fifth Amendment (Energy Meters) as FUTURE
- **Decision ID**: `DEC-LDR-003`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Ingesting G.S.R. 809(E) (Active Electrical Energy Meters).
- **Decision**: Codify Part XIV of the Eighth Schedule into the database but mark its operational status strictly as `FUTURE` with active calculation blocked until statutory commencement.
- **Rationale**: Applying a published gazette rule before its statutory transition date violates administrative law.

#### DEC-007: Correction of Rule 14 Mislabeling
- **Decision ID**: `DEC-LDR-004`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Prototype labeled generic application checkboxes as "Statutory Undertaking (Rule 14)".
- **Decision**: Remove Rule 14 citations from generic trader application declarations. Reserve Rule 14 strictly for vehicle tank and storage tank calibration profiles under the Ninth Schedule.
- **Rationale**: Rule 14 explicitly governs vehicle tanks and storage tanks. Misattributing it to grocery scales is legally indefensible.

#### DEC-008: Scope-Based Authority Resolution for GATCs
- **Decision ID**: `DEC-LDR-005`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Prototype treated GATC assignment as an open dropdown for any instrument.
- **Decision**: Implement the Authority Resolver to restrict GATC assignment strictly to verified accredited schedules and capacities. Residual jurisdiction remains exclusively with Legal Metrology Officers.
- **Rationale**: Government Approved Test Centres are accredited for specific metrological scopes; delegating un-accredited instruments to a GATC is ultra vires.

#### DEC-009: Distinction between Digital User Account and Statutory Registration
- **Decision ID**: `DEC-LDR-006`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED`
- **Context**: Defining business user onboarding terminology.
- **Decision**: Designate portal onboarding as a "Digital Platform Account" and avoid describing it as statutory registration of weights and measures users.
- **Rationale**: The Department of Consumer Affairs has clarified that statutory registration of general users of weights and measures is not generally required under the primary Act.

#### DEC-010: Backend ORM and Persistence Selection — TypeORM with PostgreSQL
- **Decision ID**: `DEC-ADR-004`
- **Date**: 2026-09-26 | **Status**: `IMPLEMENTED`
- **Context**: Choosing the persistent object-relational mapping (ORM) library for the NestJS modular monolith in Phase 1.
- **Decision**: Adopt TypeORM with PostgreSQL driver (`pg`).
- **Rationale**:
  1. Native integration with NestJS via `@nestjs/typeorm` with built-in dependency injection for repositories and entity managers.
  2. First-class declarative TypeScript decorator support for UUID primary keys, relational foreign keys, composite indexes, enums, and JSONB columns.
  3. Clean programmatic migration framework capable of running idempotent migrations during container startup or CI/CD pipelines without external binary daemons.
  4. Robust support for transactional execution across multi-table operations (critical for verification capsules and audit logs).
- **Consequences**: Entities and migrations are centralized under `server/src/database/`. Migration runner scripts (`run-migrations.ts`) can run independently or during server initialization.

#### DEC-011: Local Infrastructure Topology & Pinned Object Store Configuration
- **Decision ID**: `DEC-ADR-005`
- **Date**: 2026-09-26 | **Status**: `ACCEPTED / DECLARED`
- **Context**: Configuring local development infrastructure and distinguishing validated execution environments.
- **Decision**: 
  1. Pin MinIO object storage container image to explicit release `minio/minio:RELEASE.2024-11-07T00-52-28Z` instead of mutable `latest`.
  2. Maintain `docker-compose.yml` as **DECLARED / CONFIGURED** for containerized deployments.
  3. Formally record that Phase 1 database persistence was **VALIDATED ON HOST POSTGRESQL 16** (`127.0.0.1:5432`, cluster data path `d:\Perimeter\.pgdata`).
  4. Classify MinIO object storage strictly as: Infrastructure declared = YES, Container config = YES, Application integration = NOT IMPLEMENTED (evidence upload/retrieval planned for Phase 12).
- **Rationale**: Prevents accidental drift from unpinned container images and ensures truthful documentation of the physical validation environment.

#### DEC-012: Authentication, Password Hashing, and Token Lifecycle Architecture
- **Decision ID**: `DEC-ADR-006`
- **Date**: 2026-09-26 | **Status**: `IMPLEMENTED`
- **Context**: Designing the security, identity, and token model for Phase 2.
- **Decision**:
  1. **Password Hashing**: Adopt `bcrypt` with salt rounds = 12. Provides ~250ms hashing latency on modern server CPUs, resisting offline GPU/ASIC rainbow table attacks while preserving responsive user interactive logins.
  2. **JWT Token Pair**: Issue short-lived stateless Access Tokens (1 hour expiry, minimal claims: `sub`, `email`, `roles`, `orgId`, `jurisdictionId`) and long-lived Refresh Tokens (7 days expiry, cryptographically bound with random `jti` UUIDs to ensure non-identical rotation tokens).
  3. **Refresh Token Storage & Rotation**: Never store plaintext refresh tokens. Store bcrypt hashes of refresh tokens in `users.refreshTokenHash`. Upon refresh, rotate both tokens; any attempt to reuse an old refresh token invalidates the session.
  4. **Digital Platform Account vs Statutory Registration**: Self-registration creates a Digital Platform Account for a Business user and creates/links their Organization. This is strictly platform identity and does not constitute statutory registration under the Act.
  5. **Server-Side Authorization Boundary**: Enforce `@Roles(...)` server-side via `RolesGuard`. Client-side localStorage switching is relegated strictly to `DEMO_MODE` and never trusted by backend endpoints.



