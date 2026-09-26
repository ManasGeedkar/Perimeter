import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check(@Res() res: Response) {
    const startTime = Date.now();
    let dbStatus = 'disconnected';
    let dbLatencyMs = -1;
    let isHealthy = false;

    try {
      if (this.dataSource.isInitialized) {
        const queryStart = Date.now();
        await this.dataSource.query('SELECT 1');
        dbLatencyMs = Date.now() - queryStart;
        dbStatus = 'connected';
        isHealthy = true;
      }
    } catch (error) {
      dbStatus = 'error';
      isHealthy = false;
    }

    const payload = {
      status: isHealthy ? 'ok' : 'error',
      service: 'perimeter-backend',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: dbStatus,
      services: {
        api: {
          status: 'up',
          latencyMs: Date.now() - startTime,
        },
        database: {
          status: dbStatus,
          type: 'postgresql',
          latencyMs: dbLatencyMs,
        },
      },
    };

    const httpStatus = isHealthy
      ? HttpStatus.OK
      : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(httpStatus).json(payload);
  }
}
