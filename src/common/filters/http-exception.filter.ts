import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogsService } from '../services/logs.service';

export class AllExceptionFilter implements ExceptionFilter {
  constructor(private logsService: LogsService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exceptionResponse;

    const errorCode =
      exception?.response?.errorCode ||
      exception?.code ||
      'UNKNOWN_ERROR';

    // 🔥 GUARDAR EN BD
    await this.logsService.createLog({
      statusCode: status,
      path: request.url,
      error: typeof errorMessage === 'string'
        ? errorMessage
        : JSON.stringify(errorMessage),
      errorCode,
      session_id: (request as any).user?.id || null,
    });

    // RESPUESTA AL FRONT
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
      errorCode,
    });
  }
}