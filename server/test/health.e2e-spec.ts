import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Health and Application Lifecycle (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('1. Application Startup', () => {
    it('should successfully boot the NestJS application context', () => {
      expect(app).toBeDefined();
      expect(app.getHttpServer()).toBeDefined();
    });
  });

  describe('2 & 3. Health Endpoint & Database Connectivity', () => {
    it('GET /api/v1/health should return 200 OK with connected database status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.status).toBe('ok');
      expect(response.body.database).toBe('connected');
      expect(response.body.service).toBe('perimeter-backend');
      expect(response.body.timestamp).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.environment).toBeDefined();
    });

    it('GET /api/v1/health should never expose database credentials or secrets', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      const jsonStr = JSON.stringify(response.body);
      expect(jsonStr).not.toContain('password');
      expect(jsonStr).not.toContain('secret');
      expect(jsonStr).not.toContain('postgres:');
    });
  });

  describe('4. Error Handling and Security', () => {
    it('GET /api/v1/non-existent-route should return structured 404 without leaking server internals', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/non-existent-route')
        .expect(404);

      expect(response.body).toBeDefined();
      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
      // Ensure stack trace or internal paths are not exposed
      expect(response.body.stack).toBeUndefined();
    });
  });
});
