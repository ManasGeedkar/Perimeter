# PERIMETER: End-to-End Legal & Architectural Traceability Matrix
## Critical Implementation Status: Statutory Grounding vs Planned Engineering Deliverables

---

### Document Control
- **Document ID**: TRACE-PERIMETER-2026-V2.0
- **Version**: 2.0.0 (Post-Ingestion & Critical Implementation Audit)
- **Status**: RATIFIED SPECIFICATION / IMPLEMENTATION BASELINE
- **Target Event**: Smart India Hackathon (SIH) 2026
- **Auditor Note**: All items explicitly distinguish between what is **VERIFIED FROM SOURCE**, what is **PROTOTYPED IN FRONTEND**, and what is **PLANNED / REQUIRES IMPLEMENTATION**.

---

### 1. Legend & Status Taxonomy

- `[VERIFIED SOURCE]`: Verified directly against authoritative legal documents in `legal-sources/` (Act / GSR).
- `[IMPLEMENTED]`: Real backend/database code and automated tests genuinely exist, execute, and pass.
- `[DATABASE FOUNDATION ONLY]`: Database table, schema, and TypeORM entity exist in PostgreSQL (`server/src/database/`), but business logic, domain services, and REST API endpoints are **NOT YET IMPLEMENTED**.
- `[PROTOTYPE MOCK UI]`: Screen/component exists in React frontend shell, but currently consumes mock/in-memory data.
- `[PLANNED]`: Fully architected and mathematically defined in documentation; zero production code written yet.
- `[NOT IMPLEMENTED]`: Backend service, domain module, or automated test script does not exist in the codebase.

---

### 2. Multi-Tier Traceability Matrix

| Tier 1: Legal Source & Reference | Tier 2: Instrument & Mandate | Tier 3: Domain Rule Spec | Tier 4: Test & MPE Logic | Tier 5: Backend & API (Target) | Tier 6: UI & Mobile Status | Tier 7: Automated Test Status | Tier 8: Golden Demo Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SRC-01**: Act 2009, Sec 24<br>`[VERIFIED SOURCE]` | Commercial Weights & Measures: Mandatory verification prior to use.<br>`[VERIFIED SOURCE]` | `R-ACT-001`<br>`[PLANNED SPEC]` | Validates verification status $\ne$ EXPIRED or UNVERIFIED<br>`[PLANNED SPEC]` | `WorkflowModule`<br>`POST /api/v1/applications`<br>`[NOT IMPLEMENTED]` | `NewApplicationModal.tsx`<br>`MyApplicationsPage.tsx`<br>`[PROTOTYPE MOCK UI]` | `TC-STAT-001`<br>`[NOT IMPLEMENTED]` | **Step 4**: Merchant files application for unverified scale.<br>`[PLANNED WORKFLOW]` |
| **SRC-02**: General Rules 2011, Seventh Schedule Part II<br>`[VERIFIED SOURCE]` | Non-Automatic Weighing Instruments: Mechanical Counter Scale (Max 30 kg, Class III).<br>`[VERIFIED SOURCE]` | `VP-SCH7-P2-COUNTER-30KG`<br>4-stage test checklist<br>`[PLANNED SPEC]` | Visual, Zero balance, Eccentricity (10 kg), Load (0.1, 5, 15, 30 kg)<br>`[PLANNED SPEC]` | `VerificationModule`<br>`GET /api/v1/verifications/profile`<br>`[NOT IMPLEMENTED]` | `OfficerInspectionWorkspace.tsx`<br>`[PROTOTYPE MOCK UI]` | `TC-PROF-001`<br>`[NOT IMPLEMENTED]` | **Step 5**: Officer receives dynamic test profile for 30 kg counter scale.<br>`[PLANNED WORKFLOW]` |
| **SRC-02 & SRC-19**: Seventh Schedule, Heading-A, Part II, para 9 & MPE Tables<br>`[VERIFIED SOURCE]` | Mechanical Counter Scale: Permissible error tolerances during in-service inspection.<br>`[VERIFIED SOURCE]` | `RULE-MPE-NAWI-CLASS3`<br>`[PLANNED SPEC]` | $0 \le m \le 2.5\text{kg} \implies \pm 10\text{g}$<br>$2.5 < m \le 10\text{kg} \implies \pm 20\text{g}$<br>$10 < m \le 30\text{kg} \implies \pm 30\text{g}$<br>`[PLANNED SPEC]` | `TestEngineModule`<br>`POST /api/v1/verifications/eval`<br>`[NOT IMPLEMENTED]` | `OfficerInspectionWorkspace.tsx`<br>(Currently hardcoded static text)<br>`[PROTOTYPE MOCK UI]` | `TC-MPE-001`<br>`TV-001`<br>`TV-002`<br>`[NOT IMPLEMENTED]` | **Step 6**: Officer inputs 15.018 kg; system validates $+18\text{g} \le \pm 30\text{g}$ $\implies$ PASS.<br>`[PLANNED WORKFLOW]` |
| **SRC-19**: G.S.R. 568(E), 2026 4th Amendment<br>`[VERIFIED SOURCE]` | NAWI Verification: Standard weight substitution criteria.<br>`[VERIFIED SOURCE]` | `RULE-NAWI-SUBST-2026`<br>`[PLANNED SPEC]` | Error $\le 0.3e \implies 50\%$ Max subst.<br>$\le 0.2e \implies 80\%$ Max subst.<br>`[PLANNED SPEC]` | `TestEngineModule`<br>`POST /api/v1/tests/substitution-check`<br>`[NOT IMPLEMENTED]` | Inspection Workspace (Weighbridge Mode)<br>`[NOT IMPLEMENTED]` | `TC-SUBST-001`<br>`[NOT IMPLEMENTED]` | **Advanced Demo**: High-capacity scale using substitution weights.<br>`[PLANNED WORKFLOW]` |
| **SRC-15**: G.S.R. 905(E), 2025 7th Amendment<br>`[VERIFIED SOURCE]` | Counter machines, beam scales, fuel dispensers, weights: 24-month validity.<br>`[VERIFIED SOURCE]` | `R-GEN-027-2025`<br>Dynamic Validity Resolver<br>`[PLANNED SPEC]` | Period $= 24\text{ months}$ (Counter Scale)<br>Period $= 12\text{ months}$ (Non-amended)<br>`[PLANNED SPEC]` | `CertModule`<br>`POST /api/v1/certificates/issue`<br>`[NOT IMPLEMENTED]` | `CertificateDetailPage.tsx`<br>(Currently hardcoded +365 days)<br>`[PROTOTYPE MOCK UI]` | `TC-VAL-001`<br>`[NOT IMPLEMENTED]` | **Step 8**: Certificate issued with validity date set to $+24\text{ months}$ (Sep 2028).<br>`[PLANNED WORKFLOW]` |
| **SRC-06**: G.S.R. 149(E), 2021 Amendment, Rule 11<br>`[VERIFIED SOURCE]` | Place of Verification: NAWI $\le 50\text{ kg}$ verified at manufacture/import or local lab.<br>`[VERIFIED SOURCE]` | `RULE-VERIF-PLACE-011`<br>`[PLANNED SPEC]` | If capacity $\le 50\text{ kg} \implies$ Local office/lab or site; heavy $\implies$ on-site.<br>`[PLANNED SPEC]` | `AuthorityResolverModule`<br>`POST /api/v1/assignments/resolve`<br>`[NOT IMPLEMENTED]` | `ApplicationsPage.tsx`<br>`[PROTOTYPE MOCK UI]` | `TC-LOC-001`<br>`[NOT IMPLEMENTED]` | **Step 3**: Scale verified at local market inspection camp.<br>`[PLANNED WORKFLOW]` |
| **SRC-02**: General Rules 2011, Rule 14 & Ninth Schedule<br>`[VERIFIED SOURCE]` | Vehicle Tanks & Storage Tanks: Calibration via working measures & proving tanks.<br>`[VERIFIED SOURCE]` | `VP-SCH9-VEHICLE-TANK`<br>`[PLANNED SPEC]` | Volumetric proving tank comparison; dipstick calibration<br>`[PLANNED SPEC]` | `VerificationModule`<br>`/api/v1/verifications/profile/tank`<br>`[NOT IMPLEMENTED]` | Vehicle Tank Inspection Workspace<br>`[NOT IMPLEMENTED]` | `TC-TANK-001`<br>`[NOT IMPLEMENTED]` | **Domain Test**: Petroleum tanker calibration under Ninth Schedule.<br>`[PLANNED WORKFLOW]` |
| **SRC-09**: G.S.R. 242(E), 2025 2nd Amendment, Rule 27A<br>`[VERIFIED SOURCE]` | Volumetric Gas Meters: Special statutory re-verification intervals.<br>`[VERIFIED SOURCE]` | `RULE-GAS-METER-27A`<br>`[PLANNED SPEC]` | Re-verification interval resolved from Table 1 (5–10 years)<br>`[PLANNED SPEC]` | `RuleEngineModule`<br>`/api/v1/rules/gas-meters/validity`<br>`[NOT IMPLEMENTED]` | Gas Utility Meter Management<br>`[NOT IMPLEMENTED]` | `TC-GAS-001`<br>`[NOT IMPLEMENTED]` | **Utility Demo**: Industrial gas meter re-verification cycle.<br>`[PLANNED WORKFLOW]` |
| **SRC-11**: G.S.R. 498(E), 2025 3rd Amendment<br>`[VERIFIED SOURCE]` | Automated Sphygmomanometers: Electronic blood pressure monitors.<br>`[VERIFIED SOURCE]` | `VP-SCH8-P7B-AUTO-BP`<br>`[PLANNED SPEC]` | MPE: $\pm 0.4\text{ kPa}$ ($\pm 3\text{ mmHg}$) over $10^\circ\text{C}$ to $40^\circ\text{C}$<br>`[PLANNED SPEC]` | `TestEngineModule`<br>`/api/v1/verifications/eval/bp`<br>`[NOT IMPLEMENTED]` | Medical Device Inspection Workspace<br>`[NOT IMPLEMENTED]` | `TC-BP-001`<br>`[NOT IMPLEMENTED]` | **Medical Demo**: Hospital blood pressure monitor verification.<br>`[PLANNED WORKFLOW]` |
| **SRC-14**: G.S.R. 875(E), 2025 6th Amendment<br>`[VERIFIED SOURCE]` | Evidential Breath Analyzers: Law enforcement breath alcohol instruments.<br>`[VERIFIED SOURCE]` | `VP-SCH8-P13-BREATH-ANALYSER`<br>`[PLANNED SPEC]` | Breath volume $\ge 1.2\text{ L}$; MPE $\pm 0.020\text{ mg/L}$<br>`[PLANNED SPEC]` | `VerificationModule`<br>`/api/v1/verifications/eval/breath`<br>`[NOT IMPLEMENTED]` | Forensic Lab Testing Workspace<br>`[NOT IMPLEMENTED]` | `TC-BREATH-001`<br>`[NOT IMPLEMENTED]` | **Police Demo**: State traffic police breath analyzer certification.<br>`[PLANNED WORKFLOW]` |
| **SRC-20**: G.S.R. 809(E), 2026 5th Amendment<br>`[VERIFIED SOURCE]` | Active Electrical Energy Meters: Smart & static meters.<br>`[VERIFIED SOURCE]` | `VP-SCH8-P14-ENERGY-METER`<br>`[STAGED AS FUTURE]` | Blocked from active execution until statutory transition cutover<br>`[PLANNED SPEC]` | `RuleEngineModule`<br>`status = 'FUTURE'`<br>`[NOT IMPLEMENTED]` | Admin Rule Console (Informational Banner Only)<br>`[NOT IMPLEMENTED]` | `TC-FUTURE-001`<br>`[NOT IMPLEMENTED]` | **Governance Test**: Attempt to verify energy meter rejected as "Rule Not Yet in Force".<br>`[PLANNED WORKFLOW]` |
| **SIH Cryptographic Standard**<br>`[PLANNED SPEC]` | RFC 8785 Canonical JSON & SHA-256 Digest<br>`[PLANNED SPEC]` | `CRYPTO-CANONICAL-SHA256`<br>`[PLANNED SPEC]` | Canonicalization $\implies$ SHA-256 Digest $\implies$ Digital Signature<br>`[PLANNED SPEC]` | `EvidenceModule`<br>`POST /api/v1/crypto/digest`<br>`[NOT IMPLEMENTED]` | In-process Cryptographic Subsystem<br>(Currently fake random string)<br>`[PROTOTYPE MOCK UI]` | `TC-CRYPTO-001`<br>`[NOT IMPLEMENTED]` | **Step 7**: Canonical payload hashed; hash matches on independent verifier.<br>`[PLANNED WORKFLOW]` |
| **SIH Integrity Standard**<br>`[PLANNED SPEC]` | Append-Only Cryptographic Audit Hash Chain<br>`[PLANNED SPEC]` | `AUDIT-HASH-CHAIN-001`<br>`[PLANNED SPEC]` | $\text{Hash}_n = \text{SHA256}(\text{Payload}_n \,\|\, \text{Hash}_{n-1})$<br>`[PLANNED SPEC]` | `AuditChainModule`<br>`GET /api/v1/audit/chain/verify`<br>`[NOT IMPLEMENTED]` | Admin Audit Inspector View<br>`[NOT IMPLEMENTED]` | `TC-CHAIN-001`<br>`[NOT IMPLEMENTED]` | **Step 10**: Supervisor alters 1 character in DB; system flags chain fracture.<br>`[PLANNED WORKFLOW]` |
| **DCA Public Transparency**<br>`[PLANNED SPEC]` | Point-of-Sale Public Verification via Dynamic QR<br>`[PLANNED SPEC]` | `PUBLIC-TRUST-QR-VERIFY`<br>`[PLANNED SPEC]` | Privacy mask: Strips phone numbers, full names, internal officer IDs<br>`[PLANNED SPEC]` | `PublicModule`<br>`GET /api/v1/public/verify/:slug`<br>`[NOT IMPLEMENTED]` | `PublicCertificateVerifyPage.tsx`<br>(Currently unmasked in-memory)<br>`[PROTOTYPE MOCK UI]` | `TC-PUB-001`<br>`[NOT IMPLEMENTED]` | **Step 9**: Consumer scans QR at grocery store; instant green badge rendered.<br>`[PLANNED WORKFLOW]` |

---

### 3. Concrete Implementation Reality Summary
*(Phase 1 & Phase 2 Completed: Backend Foundation, Persistence, Authentication & RBAC)*

- **Legal Source Ingestion & Grounding**: **100% VERIFIED FROM SOURCE** (20 of 20 legal PDFs verified).
- **Domain Specifications & Test Vectors**: **100% DOCUMENTED / PLANNED** in `rules.md` and `architecture.md`.
- **Frontend Presentation Shell**: **PROTOTYPE VISUAL SHELL EXISTS** (25+ views in React/Tailwind, with `src/services/authService.ts` updated with `DEMO_MODE` explicit markers and backend integration methods).
- **Backend Infrastructure**: **IMPLEMENTED** (`server/` modular monolith in NestJS 11 LTS, TypeORM 0.3, Health module, Database module, Auth module).
- **Database & Persistence**: **IMPLEMENTED & VALIDATED ON HOST POSTGRESQL 16** (12 core tables + user auth columns migrated: `jurisdictions`, `organizations`, `users`, `roles`, `permissions`, `role_permissions`, `user_roles`, `instrument_models`, `instruments`, `legal_sources`, `legal_rule_versions`, `migrations`).
- **Authentication & RBAC**: **IMPLEMENTED** (`server/src/auth/` — JWT passport strategy, bcrypt password hashing with work factor 12, refresh token rotation with `jti` replay protection, `JwtAuthGuard`, `RolesGuard`, endpoints `POST /register`, `POST /login`, `POST /refresh`, `GET /me`, 9 core permissions seeded, and account status lifecycle checks).
- **Automated Test Scripts**: **IMPLEMENTED & PASSING (27/27 Tests)**: 6 persistence/relation/constraint tests in `test/persistence.spec.ts` + 5 lifecycle/health e2e tests in `test/health.e2e-spec.ts` + 16 authentication/RBAC/security e2e tests in `test/auth.e2e-spec.ts`.

#### Critical Architectural Distinctions: Implemented Identity vs Planned Authority & Domain Engines
The completion of Phase 2 establishes **WHO the user is** and **WHAT software role they hold**, but does **NOT** resolve statutory authority:
1. `Authentication & RBAC` (`IMPLEMENTED`) $\ne$ **GATC Legal Scope & Authority Resolver** (`[PLANNED SPEC - Phase 6]`: Evaluating whether an inspector or GATC has legal accreditation for a specific instrument schedule and capacity threshold).
2. `instruments`, `instrument_models` tables exist $\ne$ **Instrument Passport Registry API** (`[DATABASE FOUNDATION ONLY]`: CRUD endpoints, lifecycle events are **0% IMPLEMENTED - Planned Phase 3**).
3. `legal_sources` table exists $\ne$ **Legal Source Ingestion Pipeline** (`[DATABASE FOUNDATION ONLY]`: Automated PDF ingest/indexing is **0% IMPLEMENTED - Planned Phase 7**).
4. `legal_rule_versions` table exists $\ne$ **Legal Rule Engine** (`[DATABASE FOUNDATION ONLY]`: Temporal rule resolver and MPE evaluation are **0% IMPLEMENTED - Planned Phase 7 & 11**).
5. `docker-compose.yml` minio service exists $\ne$ **Object Storage / Evidence Capsule** (`[INFRASTRUCTURE DECLARED ONLY]`: Evidence upload, retrieval, and HMAC hashing are **0% IMPLEMENTED - Planned Phase 12**).
6. **Verification Workflow Engine**: **0% IMPLEMENTED** (Planned Phase 10).
7. **Cryptographic Integrity & Audit Hash Chain**: **0% IMPLEMENTED** (RFC 8785 canonical JSON, SHA-256 block chain planned Phase 13).
8. **Certificate PDF Engine & QR Portal**: **0% IMPLEMENTED** (Planned Phase 14 & 15).
9. **Field Mobile Application**: **0% IMPLEMENTED** (Flutter app planned Phase 9).
10. **Frontend API Migration**: **0% IMPLEMENTED** (Planned Phase 9; 7 mock services documented).

