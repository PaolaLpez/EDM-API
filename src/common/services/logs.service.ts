import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: {
    statusCode: number;
    path: string;
    error: string;
    errorCode: string;
    session_id?: number;
  }) {
    return this.prisma.logs.create({
      data: {
        statusCode: data.statusCode,
        timestamp: new Date(),
        path: data.path,
        error: data.error,
        errorCode: data.errorCode,
        session_id: data.session_id || null,
      },
    });
  }
}