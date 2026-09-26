# PERIMETER: Digital Instrument-Trust & Verification Lifecycle Platform
## Product Requirements Document (PRD)

---

### Document Control
- **Document ID**: PRD-PERIMETER-2026-V1.0
- **Version**: 1.0.0
- **Status**: APPROVED BASELINE
- **Target Event**: Smart India Hackathon (SIH) 2026
- **Domain**: Ministry of Consumer Affairs, Food & Public Distribution — Department of Consumer Affairs (Legal Metrology Division)

---

### 1. Executive Summary & One-Line Description
**PERIMETER** is a digital instrument-trust and verification lifecycle platform that creates an auditable, cryptographically verifiable, and legally anchored digital passport for every weighing and measuring instrument under the Legal Metrology Act, 2009 and Legal Metrology (General) Rules, 2011.

---

### 2. Problem Statement
In India's trade, commercial, and industrial ecosystems, millions of weighing and measuring instruments are deployed across diverse sectors—from local grocers and ration shops to weighbridges, manufacturing plants, and petroleum dispensing units. Today, verification and certification processes suffer from acute vulnerabilities:
1. **Paper-Centric & Fragmented Records**: Verification certificates exist primarily as printed paper documents or isolated local files, prone to forgery, tampering, or misplacement.
2. **Disconnected Lifecycle**: An instrument’s lifecycle (onboarding, calibration, periodic re-verification, repair, seal replacement, movement, decommissioning) is fragmented across disconnected registers.
3. **Lack of Dynamic Legal Alignment**: Maximum Permissible Error (MPE) calculations, verification intervals, and testing criteria are often applied via static memory or hardcoded assumptions rather than being resolved dynamically from applicable legal schedules and amendment dates.
4. **Counterfeits & Seal Tampering**: Physical lead/wire seals can be broken or falsified with no verifiable chain-of-custody linking the physical seal to an immutable digital verification record.
5. **No Public Verifiability**: Citizens and downstream businesses have no instantaneous, trustworthy mechanism to scan a QR code at a point of sale and verify whether the specific weighing instrument is legally certified, who verified it, under what rule, and whether that certification is currently active.
6. **Supervisory Black Box**: Appellate bodies, Controllers of Legal Metrology, and supervisory officers cannot "replay" a past verification to understand why an instrument passed or failed, what exact measurements were recorded, and whether the reference standards used were valid at that time.

---

### 3. Background & Statutory Framework
Legal Metrology in India is governed by:
- **Legal Metrology Act, 2009 (Act No. 1 of 2010)**: Establishes standards of weights and measures, regulation of trade and commerce in weights, measures and other goods.
- **Legal Metrology (General) Rules, 2011**: Prescribes technical specifications, schedules, verification scale intervals, MPE tables, and testing procedures.
- **Subsequent Amendments**: Including the 2025 Seventh Amendment (revising verification periods under Rule 27(2)(a) to 24 months for specified categories) and the 2026 Fifth Amendment (introducing requirements for Active Electrical Energy Meters with phased effective dates).
- **State Legal Metrology (Enforcement) Rules**: State-specific jurisdictional, fee, and administrative procedures.

*Critical Distinction*: Perimeter does not represent digital account onboarding as statutory registration of users of weights/measures (which is not generally required under the Act according to DCA guidance), but as a secure digital portal identity.

---

### 4. Stakeholders & User Personas

| Persona ID | Stakeholder Role | Primary Responsibilities & Interactions |
| :--- | :--- | :--- |
| **PER-01** | **Business / Instrument Owner** | Onboard instruments (new & legacy), track certification expiry, apply for initial/periodic verification, view verification history, manage repair/seal requests, lodge disputes. |
| **PER-02** | **Legal Metrology Officer (LMO)** | Field inspection officer. Receives assigned verifications, validates reference standards, conducts guided on-site testing, logs readings, captures geotagged evidence, determines PASS/FAIL, stamps seals, cryptographically signs records. |
| **PER-03** | **Govt. Approved Test Centre (GATC)** | Scope-authorized testing laboratory. Performs specialized verifications within authorized schedule scopes, generates lab test records, submits evidence capsules. |
| **PER-04** | **Administrator / Controller** | HQ & State Controllers. Manages jurisdictions, approves GATC scopes, reviews audit hash chains, oversees officer workload, inspects appeals/disputes, configures legal rule updates. |
| **PER-05** | **Citizen / Public Consumer** | Scans QR code on instrument/certificate at points of sale, verifies authenticity, views non-sensitive verification details, flags expired or unverified instruments. |

---

### 5. Project Vision & Core Differentiator

#### The Fundamental Question
> **"Why should anyone trust this verification result?"**

Perimeter answers this by making every verification decision reconstructable from an immutable, canonical evidence capsule anchored by cryptographic integrity hashes.

#### Architectural Differentiation
Perimeter is **NOT**:
- A generic certificate PDF repository
- A basic CRUD form for inspections
- A superficial QR label generator
- A role-switching mockup prototype

Perimeter **IS**:
```
PHYSICAL INSTRUMENT
        ↓
DIGITAL INSTRUMENT IDENTITY (Passport)
        ↓
LEGAL RULE RESOLUTION (Schedules, Rules, Effective Dates)
        ↓
AUTHORIZED VERIFICATION (LMO vs GATC Scope Resolver)
        ↓
GUIDED TEST PROCEDURE (Dynamic Profile & Prescribed Steps)
        ↓
MEASUREMENTS + GEOTAGGED EVIDENCE
        ↓
RULE-BASED DECISION (Deterministic MPE Engine)
        ↓
CRYPTOGRAPHICALLY INTEGRITY-PROTECTED RECORD (SHA-256 Canonicalization + Digital Signature)
        ↓
CERTIFICATE LIFECYCLE (Active, Suspended, Revoked, Superseded)
        ↓
PUBLIC QR VERIFICATION (Privacy-Preserving Consumer Trust)
        ↓
CONTINUOUS LIFECYCLE (Re-verification, Seal Replacement, Audit Replay)
```

---

### 6. The Golden Demo: Legacy 30 kg Mechanical Counter Scale
To prove that Perimeter solves real-world challenges rather than idealized greenfield assumptions, the core end-to-end reference demo is:
1. **Legacy Onboarding**: A rural grain merchant onboards a 12-year-old 30 kg mechanical counter scale with a partially scuffed serial nameplate.
2. **Provisional Identity**: Perimeter assigns a provisional identity (`TEMP-INST-2026-XXXX`) with required physical condition photos and location coordinates.
3. **Application & Authority Resolution**: Application filed. The Legal Rule Engine maps the scale to the **Seventh Schedule, Part II** under the General Rules, 2011; checks whether GATC is eligible or if State LMO has sole jurisdiction; resolves verification interval (24 months per 2025 Seventh Amendment).
4. **Officer Assignment & Standard Check**: LMO assigned. LMO selects verified Working Standard Weights (traceable certificate active).
5. **Guided Field Inspection**: Dynamic checklist generated (leveling, knife-edge/bearing check, zero-load, 1/6 Max, 1/2 Max, Max 30 kg, eccentricity).
6. **Deterministic MPE Calculation**: LMO enters indicated readings; system computes deviation against Seventh Schedule MPE tables; displays exact allowable tolerance (±15 g or applicable class tolerance).
7. **Evidence Capsule Generation**: Geotagged photos of physical scale, inspector, lead seal #MP-IND-XXXX, test readings, and timestamps bundled into a canonical JSON payload.
8. **Integrity Hash & Signature**: Canonical payload is hashed via SHA-256; officer applies cryptographic signature key; event is committed to the PostgreSQL audit hash chain.
9. **Certificate & Public QR**: Official Certificate issued; provisional ID converted to permanent Instrument Passport ID; dynamic QR code generated.
10. **Public Verification**: A customer scans the QR code on a mobile device and verifies validity, issuing officer, and legal rule version without exposing merchant phone numbers or private data.
11. **Dispute & Replay**: A simulated dispute triggers "Verification Replay," where a supervisor audits the exact inputs, MPE calculation logic, and evidence capsule.

---

### 7. Functional Requirements

#### 7.1 Authentication & Stakeholder Management
- **PRD-AUTH-001** `[IMPLEMENTED - Phase 2]`: System must support strict multi-tenant role-based access control (RBAC) across Business, LMO, GATC, Admin, and Public roles (`RolesGuard`, `@Roles(...)`).
- **PRD-AUTH-002** `[IMPLEMENTED - Phase 2]`: Frontend role switching must be completely disabled in production environments; all authorization decisions must be validated server-side on every API request. Frontend `authService.ts` explicitly demarcated as `DEMO_MODE`.
- **PRD-AUTH-003** `[IMPLEMENTED - Phase 2]`: System must authenticate users via JWT access tokens with short TTLs (15 min) and cryptographically signed claims, paired with stateful rotated refresh tokens (7 days) with `jti` replay protection.
- **PRD-AUTH-004** `[IMPLEMENTED - Phase 1 & 2]`: System must record organizational structures, LMO offices, GATC accreditation boundaries, and geographic jurisdictions down to state, district, and tehsil/taluka levels. Digital platform accounts are strictly separated from statutory registration.

#### 7.2 Instrument Passport & Identity
- **PRD-INST-001**: Every instrument must possess a unique, persistent digital identity ("Instrument Passport") that survives individual verification events.
- **PRD-INST-002**: Passport must store metadata: serial number, manufacturer, model, model approval reference, category, type, capacity, unit, accuracy class, verification scale interval ($e$), actual scale interval ($d$), physical location coordinates, owner organization, and physical seal registry.
- **PRD-INST-003**: System must support **Legacy Instrument Onboarding**, handling missing, damaged, or unreadable nameplates by issuing a provisional identity with mandatory officer physical resolution workflows.
- **PRD-INST-004**: System must maintain a tamper-evident event log for each instrument: initial registration, applications, verifications, seal breaks, repairs, ownership transfers, movements, and retirements.

#### 7.3 Legal Rule Engine & Authority Resolution
- **PRD-RULE-001**: Legal rules must NOT be hardcoded into frontend components. All rules, schedules, MPE tables, and verification intervals must be loaded dynamically from a versioned legal rule repository.
- **PRD-RULE-002**: Rule engine must evaluate rule status: `ACTIVE`, `FUTURE` (not yet in effect), and `SUPERSEDED`. Rules must only be applied if the verification date falls within `[effective_from, effective_until]`.
- **PRD-RULE-003**: Engine must distinguish Legal Metrology Act, 2009 vs Legal Metrology (General) Rules, 2011 vs State Enforcement Rules vs specific Amendments.
- **PRD-RULE-004**: System must resolve verification validity periods dynamically (e.g., 24 months for specified weights/measures per 2025 Seventh Amendment to Rule 27; 12 months for non-amended categories). Universal 1-year hardcoding is strictly forbidden.
- **PRD-RULE-005**: Authority Resolver must determine whether an inspection must be conducted by an LMO or may be delegated to a GATC based on legal scope, accredited schedule part, and jurisdiction.

#### 7.4 Guided Field Inspection & Test Engine
- **PRD-VER-001**: Inspection workflows must be dynamically generated from the instrument's applicable legal schedule profile (e.g., Seventh Schedule Part I for non-automatic weighing instruments).
- **PRD-VER-002**: Officer must validate and bind active reference standard equipment (with non-expired calibration certificate) before entering test observations.
- **PRD-VER-003**: Field testing must capture prescribed steps: visual inspection, zero error, repeatability, eccentricity (off-center loading), and increasing/decreasing load tests up to Max capacity.
- **PRD-VER-004**: Test Engine must perform deterministic MPE calculations on entered readings, indicating Pass/Fail with exact mathematical delta and statutory reference.
- **PRD-VER-005**: Overall decision must be calculated deterministically; an officer cannot mark an instrument "PASS" if any mandatory legal tolerance test failed without formal exception logging.

#### 7.5 Evidence Capsule & Cryptographic Integrity
- **PRD-EVID-001**: Every verification must generate a sealed **Evidence Capsule** containing: instrument snapshot, test readings, physical condition checklist, geotagged device coordinates, UTC timestamp, reference standard IDs, seal numbers, and high-resolution captured photos.
- **PRD-EVID-002**: Evidence data must be serialized using a deterministic, canonical JSON specification (RFC 8785) prior to hashing.
- **PRD-EVID-003**: System must calculate a genuine SHA-256 cryptographic digest of the canonical evidence capsule. Fake or randomly generated hash strings are strictly prohibited.
- **PRD-EVID-004**: System must store digital signature metadata: algorithm, key identifier, timestamp, and signature payload applied by the authorized officer.
- **PRD-EVID-005**: All critical audit events must be appended to an **Audit Hash Chain** where each block contains `Hash_n = SHA256(Event_Payload_n + Hash_{n-1})`, ensuring tamper detection.

#### 7.6 Certificate Lifecycle & Public Verification
- **PRD-CERT-001**: System must generate official digital certificates with unique identifiers derived from state code, district code, year, and sequence.
- **PRD-CERT-002**: Certificate lifecycle must support: `DRAFT`, `ISSUED` (Valid), `EXPIRED`, `SUSPENDED`, `REVOKED`, and `SUPERSEDED`.
- **PRD-CERT-003**: Certificates must display the exact legal rule authority, issue date, calculated statutory expiry date, verifying officer/GATC, lead seal numbers, and verification integrity hash.
- **PRD-PUBLIC-001**: Public verification page accessible via QR code must allow any citizen to verify certificate status instantly without requiring authentication.
- **PRD-PUBLIC-002**: Public verification must strictly enforce data privacy: masking personal contact numbers, specific business financial data, or internal officer employee identifiers, displaying only instrument specs, status, validity dates, and issuing authority.

#### 7.7 Disputes, Independent Review & Verification Replay
- **PRD-DISPUTE-001**: Business owners must have the right to lodge an objection/dispute against a FAIL or REJECT decision within a statutory timeframe.
- **PRD-DISPUTE-002**: Upon dispute filing, the associated evidence capsule and verification record must enter an immutable locked state.
- **PRD-DISPUTE-003**: Supervisors must have access to a **Verification Replay Engine** that reconstructs the entire verification event: active legal rule version at the time, reference standards used, raw inputs, MPE limits applied, and evidence photos.

#### 7.8 Reporting, Dashboards & Notifications
- **PRD-REP-001**: Role-tailored dashboards must present real-time metrics: compliance rate, impending expiries (30/60/90 days), pending applications, officer field loads, and regional verification coverage.
- **PRD-NOTIF-001**: System must generate persistent automated notifications for upcoming expiries, assignment alerts, inspection schedule updates, and certificate status changes.

---

### 8. Non-Functional Requirements (NFR)
- **NFR-PERF-001**: Public QR verification page must render and return status in < 1.0 second on standard 4G mobile networks.
- **NFR-SEC-001**: Zero trust architecture; all API inputs sanitized and validated via class-validator; SQL injection and XSS defenses enforced.
- **NFR-AVAIL-001**: System designed for 99.9% uptime with containerized stateless backend services.
- **NFR-COMP-001**: Responsive web interface supporting desktop, tablet, and mobile form factors (viewports down to 320px).
- **NFR-AUDIT-001**: 100% of state-changing transactions must be logged in the immutable audit trail.
- **NFR-OFFLINE-001**: Architecture must accommodate future field mobile apps (Flutter) with local SQLite persistence and conflict-free sync mechanisms.

---

### 9. Non-Goals & Out of Scope (Phase 1 Baseline)
- **Non-Goal 1**: Replacing the Legal Metrology officer with autonomous AI. The legal engine is deterministic and statutory; AI is purely advisory and deferred to later phases.
- **Non-Goal 2**: Universal statutory business registration. DCA guidelines do not mandate general statutory registration of users of weights/measures under the central Act.
- **Non-Goal 3**: Microservice explosion or Kafka/RabbitMQ brokers during initial hackathon deployment. A clean modular NestJS monolith with PostgreSQL and Docker Compose is prioritized.

---

### 10. Requirement Traceability Matrix Reference
Every functional requirement defined above links directly to components in `architecture.md`, statutory articles in `rules.md`, roadmap deliverables in `phases.md`, and screen states in `design.md`.
