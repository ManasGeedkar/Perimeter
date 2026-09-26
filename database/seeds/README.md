# PERIMETER Database Seeds

This directory contains reference seed data and initial baseline entities for testing and development.

## Seed Execution
Baseline entities are seeded via `server/src/database/seed.service.ts` which populates:
- Administrative & enforcement jurisdictions (Maharashtra, Madhya Pradesh, etc.)
- Demo organizations (Traders, Manufacturers, LMO Offices, GATC Laboratories)
- Standard user accounts with hashed credentials and assigned roles
- Golden Demo instrument models (e.g., ScalePro-2026, Essae-Teraoka DS-852)
- Legal sources and rules (Legal Metrology Act 2009, General Rules 2011)
