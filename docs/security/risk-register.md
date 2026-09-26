# PERIMETER: Master Risk Register & Mitigation Strategy
## Comprehensive Assessment of Legal, Technical, Operational & Security Risks

---

### Document Control
- **Document ID**: RISK-PERIMETER-2026-V1.0
- **Version**: 1.0.0
- **Status**: RATIFIED RISK REGISTER
- **Target Event**: Smart India Hackathon (SIH) 2026

---

### 1. Risk Matrix & Evaluation Framework

Risks are quantified using a standard $5 \times 5$ severity matrix:
$$\text{Risk Score} = \text{Likelihood (1–5)} \times \text{Impact (1–5)}$$

| Score Range | Severity Level | Action Required |
| :---: | :---: | :--- |
| **15 – 25** | **CRITICAL** | Immediate mitigation plan; mandatory architectural block before Phase 1. |
| **8 – 14** | **HIGH / MEDIUM** | Active tracking; dedicated test cases and phase validation gates. |
| **1 – 7** | **LOW** | Monitored periodically; standard defensive programming. |

---

### 2. Comprehensive Risk Register

| Risk ID | Domain | Risk Description | Likelihood | Impact | Score | Mitigation Strategy & Safeguards | Target Phase |
| :---: | :---: | :--- | :---: | :---: | :---: | :--- | :---: |
| **RSK-LEG-001** | Legal | **Premature Enforcement of Future Rules**: Applying G.S.R. 809(E) (Energy Meters) or future amendments before statutory transition dates. | 3 | 5 | **15 (Crit)** | Rule Engine evaluates `effective_from <= inspection_date <= effective_until`. Future rules staged strictly as `FUTURE` and blocked from active calculation. | Phase 7 |
| **RSK-LEG-002** | Legal | **Legal Misattribution in Defense of Certificates**: Citing obsolete rules or mislabeling Rule 14 in issued certificates, causing legal invalidity in court. | 3 | 5 | **15 (Crit)** | Certificate generation binds the exact `rule_version_id` resolved by the Rule Engine; static string hardcoding completely prohibited in certificate generator. | Phase 14 |
| **RSK-LEG-003** | Legal | **Ultra Vires GATC Assignment**: Delegating high-risk or un-accredited instrument verification to an unqualified test centre. | 2 | 5 | **10 (High)** | Authority Resolver verifies GATC accreditation schedules and capacity thresholds against database bounds before allowing assignment. | Phase 6 |
| **RSK-LEG-004** | Legal | **Ignoring 2025 7th Amendment**: Hardcoding 1-year renewals for retail scales, exposing merchants to unnecessary fees and regulatory confusion. | 4 | 4 | **16 (Crit)** | Dynamic validity resolver applies 24-month validity to the 7 gazetted categories per G.S.R. 905(E). Unit tests validate validity calculation. | Phase 14 |
| **RSK-TECH-001**| Technical | **Forensic Evidence Tampering**: Manipulation of raw verification readings or photos in the database after certificate issuance. | 3 | 5 | **15 (Crit)** | RFC 8785 canonical JSON hashed via SHA-256 and anchored in PostgreSQL append-only audit hash chain (`Hash_n = SHA256(Payload_n + Hash_{n-1})`). | Phase 13 |
| **RSK-TECH-002**| Technical | **GPS Telemetry Spoofing**: Field officers faking GPS coordinates while verifying instruments remotely without visiting the merchant. | 3 | 4 | **12 (High)** | Hardware device binding, geofencing checks against registered instrument coordinates, and network cell-tower / IP cross-validation. | Phase 12 |
| **RSK-TECH-003**| Technical | **Public QR Verification DDoS / Performance Lag**: Citizen QR scans at grocery stores lagging due to database bottlenecks. | 3 | 3 | **9 (Med)** | Public verification endpoint is unauthenticated, reads from indexed read-replicas or Redis cache, and returns stripped, privacy-masked JSON in < 500ms. | Phase 15 |
| **RSK-TECH-004**| Technical | **Offline Sync Conflict in Field App**: Inspector records offline inspections that conflict with server-side revocations or transfers. | 3 | 4 | **12 (High)** | Optimistic concurrency control via version vectors; server-side conflict resolution policies prioritizing statutory lock states. | Phase 9 |
| **RSK-TECH-005**| Technical | **Docker Compose Container Reproducibility**: Phase 1 persistence was validated against host PostgreSQL; Docker-based execution has not been verified in CI/staging host. | 2 | 3 | **6 (Low)** | Pre-production validation of `docker-compose.yml` on a Linux staging runner or Docker-enabled host prior to Phase 19. | Phase 19 |
| **RSK-TECH-006**| Technical | **Object Storage Integration Latency**: MinIO container is configured but application integration, photo upload, and retrieval are deferred. | 2 | 4 | **8 (Med)** | EvidenceModule integration scheduled for Phase 12 with AWS S3 SDK / MinIO client integration tests. | Phase 12 |
| **RSK-SEC-001** | Security | **Client-Side Privilege Elevation**: Malicious users modifying localStorage tokens to bypass role boundaries. | 1 | 5 | **5 (Low / Mitigated)** | **MITIGATED (Phase 2)**: Server-side NestJS JWT Passport guards (`JwtAuthGuard`), bcrypt password hashing (12 rounds), and `@Roles()` / `RolesGuard` implemented; frontend localStorage marked strictly `DEMO_MODE`. | Phase 2 |
| **RSK-SEC-002** | Security | **Privacy Leakage on Public QR Scan**: Citizen QR scanner exposing trader phone numbers, private residential addresses, or financial data. | 4 | 4 | **16 (Crit)** | Strict Data Transfer Object (DTO) sanitization stripping all PII before sending public verification responses. | Phase 15 |
| **RSK-OPS-001** | Operations| **Scope Creep across 20 Phases within Hackathon**: Over-engineering non-critical features and failing to deliver the core verification chain. | 4 | 4 | **16 (Crit)** | Strict phase progression gate: Prioritize Phases 1–15 (MVP) and the Golden Demo (30 kg mechanical scale). Defer Phase 20 (AI) to post-hackathon. | Phase 0–19 |
| **RSK-OPS-002** | Operations| **SIH Jury Scrutiny on Mock vs Real Functionality**: Evaluators discovering simulated data, random hashes, or fake signatures during live demonstration. | 4 | 5 | **20 (Crit)** | Zero mock data in production path. All hashes, signatures, GPS, and MPE calculations must be 100% mathematically authentic and live. | Phase 1–19 |

---

### 3. Critical Risk Mitigation Action Items Before Phase 1 Approval
1. **Approval Gate 1**: Ensure all legal uncertainties from the 20 PDFs are codified in `rules.md` with source provenance.
2. **Approval Gate 2**: Lock the 38-point defect registry in `memory.md` to prevent regression.
3. **Approval Gate 3**: Validate that the backend scaffold planned in Phase 1 directly consumes the relational schema defined in `architecture.md`.
