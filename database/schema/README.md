# PERIMETER Database Schema

This directory contains the schema definitions and reference DDL for PostgreSQL 16.

## Core Tables (Phase 1 & Phase 2 Baseline)
1. `jurisdictions`: Metrology enforcement jurisdictions (states and districts)
2. `organizations`: Stakeholder establishments (Business, LMO, GATC, Administration)
3. `users`: System users with credentials, roles, and status
4. `roles`: Role-based access control roles
5. `permissions`: Granular permission nodes
6. `role_permissions`: Join table mapping roles to permissions
7. `user_roles`: Join table mapping users to roles
8. `instrument_models`: Pattern approval and model specifications
9. `instruments`: Digital Instrument Passport and physical-identity registry
10. `legal_sources`: Ingested legal metrology acts and rules
11. `legal_rule_versions`: Temporal rule versions and verification schedules
12. `migrations`: TypeORM migration execution history
