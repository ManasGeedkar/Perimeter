# PERIMETER API Documentation

RESTful API specification and architectural endpoints for the PERIMETER backend modular monolith.

## Base URL
`/api/v1`

## Implemented Endpoints (Phase 1 & Phase 2 Baseline)
- `GET /health` : Live database connectivity, timestamp, system status
- `POST /auth/register` : Stakeholder registration
- `POST /auth/login` : User authentication and JWT token issuance
- `POST /auth/refresh` : Refresh token rotation
- `GET /auth/me` : Current authenticated stakeholder profile
