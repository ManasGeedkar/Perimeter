# PERIMETER: Frontend Legal & Domain Conflicts Registry
## Targeted Forensic Audit of React Prototype Codebase against Authoritative Statutory Corpus

---

### Document Control
- **Document ID**: LFC-PERIMETER-2026-V1.0
- **Version**: 1.0.0
- **Status**: RATIFIED CONFLICTS REGISTRY
- **Target Application**: React 19 Frontend (`src/`)
- **Corpus Cross-Reference**: Legal Metrology Act, 2009 & General Rules, 2011 (with Amendments)

---

### 1. Executive Summary of Audit Findings
A comprehensive sweep of the existing React prototype was performed across all TypeScript source files, internationalization dictionaries (`i18n`), and component templates. A total of **18 major legal, cryptographic, and procedural conflicts** were identified. 

None of these conflicts may be resolved by ad-hoc UI patching. Every issue is mapped to a specific implementation phase where it will be replaced by deterministic backend services and authoritative database records.

---

### 2. Granular Legal & Domain Conflicts Register

| Conflict ID | File & Line Number | Existing Prototype Behavior | Statutory Defect & Risk | Authoritative Legal Source | Required Remediation | Target Phase |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **CON-01** | `src/components/applications/NewApplicationModal.tsx` (Line 529) | `<p className="font-semibold text-[#1E75AC]">Statutory Undertaking (Rule 14)</p>` | **Mislabeling**: Rule 14 governs calibration and verification of **Vehicle Tanks and storage tanks** under the Ninth Schedule. It is NOT a general trader declaration. | Rule 14 & Ninth Schedule, General Rules, 2011 (SRC-02) | Remove "(Rule 14)" citation from generic application modal; create dedicated Vehicle Tank profile. | Phase 5 |
| **CON-02** | `src/i18n/en.ts` (Line 225) & `hi.ts` | `'cert.statutoryRule': '[See Rule 14(1) of the Legal Metrology (General) Rules, 2011]'` | **Mislabeling on Certificates**: Citing Rule 14(1) as the universal certificate authority across all weighing instruments is legally incorrect. | Rule 13, General Rules, 2011 (SRC-02) | Dynamically resolve statutory rule citation based on instrument category (Seventh Schedule for weighing, Eighth Schedule for measuring). | Phase 14 |
| **CON-03** | `src/pages/dashboard/DashboardPage.tsx` (Line 689) | `<strong>Rule 14:</strong> Holographic digital seal and public QR certificate must be displayed at point of sale.` | **Fabricated Rule Description**: Rule 14 contains no mention of point-of-sale QR certificates or digital seals. | Rule 14, General Rules, 2011 (SRC-02) | Re-anchor display mandate under State Enforcement Rules / Section 24 compliance guidelines. | Phase 18 |
| **CON-04** | `src/services/certificateService.ts` (Lines 119–123, 156) | `nextYear.setFullYear(today.getFullYear() + 1); ... daysRemaining: 365` | **Hardcoded Universal 1-Year Expiry**: Violates the **2025 Seventh Amendment**, which mandates a **24-month (2-year)** validity period for counter machines, beam scales, weights, length measures, and fuel dispensers. | Rule 27(2)(a) amended by G.S.R. 905(E) (SRC-15) | Connect certificate generation to dynamic `validityResolver` evaluating instrument type against Rule 27. | Phase 14 |
| **CON-05** | `src/pages/public/LandingPage.tsx` (Cards & FAQ) | Copy claims *"All commercial scales require mandatory annual re-verification"*. | **Misleading Public Copy**: Conveys outdated legal information to traders and citizens. | G.S.R. 905(E), 18th Dec 2025 (SRC-15) | Update landing copy to reflect 24-month verification for retail scales and fuel dispensers. | Phase 18 |
| **CON-06** | `src/pages/verification/VerificationWorkspacePage.tsx` (Line 108) | `alert('Statutory Requirement: A detailed failure reason is mandatory for FAIL results under Section 24.');` | **Statutory Misattribution**: Section 24 of the Act governs verification mandates in commercial transactions; it does not contain this specific failure-logging clause. | Section 24, Legal Metrology Act, 2009 (SRC-01) | Replace alert with standard administrative due process validation ("Rejection reason required for appellate record"). | Phase 10 |
| **CON-07** | `src/pages/officer/OfficerInspectionWorkspacePage.tsx` (Line 44) | Default remarks: `'...Instrument satisfies OIML R-76 Class III standard tolerances.'` | **Global OIML Hardcoding**: OIML R-76 applies strictly to Non-Automatic Weighing Instruments. Inappropriate for flow meters, gas meters, or radar. | Seventh Schedule, Part I (SRC-02) | Generate remarks and tolerance criteria dynamically from the active `VerificationProfile`. | Phase 10 |
| **CON-08** | `src/i18n/en.ts` (Line 155) & `hi.ts` (Line 157) | `'officer.standardsSub': 'Legal Metrology (General) Rules 2011 & OIML R-76 calibration tolerance criteria apply.'` | **Global UI Labeling**: Embeds OIML R-76 as a static subheader across all officer testing screens. | General Rules, 2011 (SRC-02) | Bind subtitle dynamically to the specific schedule (e.g. "Seventh Schedule, Part II"). | Phase 10 |
| **CON-09** | `src/services/verificationService.ts` (Lines 7–13) | `DEFAULT_TEST_OBSERVATIONS`: Static 5-row table (5 kg, 15 kg, 30 kg, Corner 1, Corner 4) hardcoded. | **Static Test Matrix**: Cannot adapt to other capacities (e.g., 50 kg scale, 100-tonne weighbridge, or liquid flow meter). | Seventh Schedule & Part II paragraph 9 (SRC-02, SRC-19) | Load test definitions and load points dynamically from database `test_definitions` table. | Phase 11 |
| **CON-10** | `src/pages/verification/VerificationWorkspacePage.tsx` (Lines 1–669) | Entire 669-line redundant inspection workspace file present alongside `OfficerInspectionWorkspacePage.tsx`. | **Code Duplication & Drift**: Routes in `App.tsx` alias over it, leaving dead, divergent verification logic. | Clean Code & Single Source of Truth | Deprecate and remove file; consolidate into single Guided Inspection workflow. | Phase 10 |
| **CON-11** | `src/pages/verification/VerificationWorkspacePage.tsx` (Line 100) | `setGpsCoords({ lat: 22.7196 + (Math.random() * 0.01 - 0.005), lng: ... })` | **Forensic Falsification**: Generates simulated GPS coordinates when browser geolocation fails. | Evidentiary Standard for Statutory Proceedings | Mandate explicit geolocation permission; disable verification submission if valid GPS lock is unavailable. | Phase 12 |
| **CON-12** | `src/services/certificateService.ts` (Line 131) | `const hash = 'SHA256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');` | **Cryptographic Falsification**: Generates pseudo-random hexadecimal strings instead of genuine SHA-256 digests. | Information Technology Act, 2000 & SIH Trust Mandate | Compute authentic SHA-256 digest of canonical RFC 8785 evidence payload. | Phase 13 |
| **CON-13** | `src/services/verificationService.ts` (Line 35) | `digitalSignature: 'SIG_SHA256_RAJESH_KUMAR_IND_2026'` | **Decorative Signature**: Arbitrary string pretending to be a cryptographic signature. | Digital Signature Evidentiary Requirements | Store structured signature container (algorithm, public key ID, signed timestamp, signature payload). | Phase 13 |
| **CON-14** | `src/pages/public/PublicCertificateVerifyPage.tsx` (Lines 196–201) | Renders full unmasked owner name, business name, and location in public view. | **Privacy Leakage**: Exposes trader personal and contact details to anyone scanning the public QR code. | Citizen Trust & Data Privacy Mandates | Mask personal identifiers (e.g. `R******r P*****r`, district and state only, zero phone numbers). | Phase 15 |
| **CON-15** | `src/services/authService.ts` (Lines 66–70) | `switchRole: (role: UserRole) => { localStorage.setItem('lmv_current_user', ...) }` | **Insecure Role Elevation**: Client-side role selection without server credential validation. | Zero Trust Security Model | Restrict role switching to isolated development mock toolbar; enforce server-signed JWT on all routes. | Phase 2 |
| **CON-16** | `src/pages/officer/OfficerInspectionWorkspacePage.tsx` (Lines 39, 58) | Uses static Unsplash stock photo URLs for scale and nameplate inspection. | **Evidentiary Defect**: Stock imagery used in place of actual field evidence. | Evidential Integrity Requirements | Integrate real camera capture and file upload to MinIO / S3 object storage. | Phase 12 |
| **CON-17** | `src/services/applicationService.ts` (Lines 114–136) | Assigns GATC without checking accreditation schedule or capacity limits. | **Unauthorized Jurisdiction**: GATCs can only verify instruments within their accredited scope. | GATC Rules & Accreditation Orders (SRC-02, SRC-09) | Route assignments through the Authority Resolver validating GATC accreditation boundaries. | Phase 6 |
| **CON-18** | `src/services/api.ts` (Line 5) | `baseURL: 'https://api.legalmetrology.gov.in/v1'` | **Non-existent API Target**: Points to a hypothetical government domain with fallback to in-memory state. | Production API Architecture | Configure local and staging environment URLs pointing to the NestJS container (`/api/v1`). | Phase 1 |

---

### 3. Verification Protocol Before Fixing Conflicts
To maintain documentation integrity, none of the above files will be modified ad-hoc. Each conflict is scheduled for elimination during its assigned implementation phase as defined in [phases.md](file:///d:/Perimeter/phases.md).
