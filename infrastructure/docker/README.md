# Docker Infrastructure

Docker configuration for the PERIMETER application.

Primary multi-container orchestration is defined at the project root in `docker-compose.yml`:
- **PostgreSQL 16 Alpine**: Relational database (`perimeter_db`) on port 5432
- **MinIO S3**: Object storage (`perimeter_minio`) on port 9000 (API) and 9001 (Console)
