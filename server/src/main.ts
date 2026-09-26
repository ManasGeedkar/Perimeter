import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const logger = new Logger('PERIMETER-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API Versioning Prefix
  app.setGlobalPrefix('api/v1');

  // Input Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS Configuration
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  app.enableCors({
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`PERIMETER Core API running on: http://localhost:${port}/api/v1`);
  logger.log(`Health check ready at: http://localhost:${port}/api/v1/health`);
}
void bootstrap();
