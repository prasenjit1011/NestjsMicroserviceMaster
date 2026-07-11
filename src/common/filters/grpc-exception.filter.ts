import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { status as GrpcStatus } from '@grpc/grpc-js';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // -------------------------------------------------
    // Let normal HTTP exceptions keep their own status.
    // -------------------------------------------------
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const error = exception.getResponse();

      response.status(status).json(error);
      return;
    }

    // -------------------------------------------------
    // Handle gRPC exceptions only.
    // -------------------------------------------------
    const grpcCode = exception?.code;
    const message =
      exception?.details ??
      exception?.message ??
      'Internal server error';

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (grpcCode) {
      case GrpcStatus.INVALID_ARGUMENT:
        httpStatus = HttpStatus.BAD_REQUEST;
        break;

      case GrpcStatus.NOT_FOUND:
        httpStatus = HttpStatus.NOT_FOUND;
        break;

      case GrpcStatus.ALREADY_EXISTS:
        httpStatus = HttpStatus.CONFLICT;
        break;

      case GrpcStatus.UNAUTHENTICATED:
        httpStatus = HttpStatus.UNAUTHORIZED;
        break;

      case GrpcStatus.PERMISSION_DENIED:
        httpStatus = HttpStatus.FORBIDDEN;
        break;

      case GrpcStatus.DEADLINE_EXCEEDED:
        httpStatus = HttpStatus.GATEWAY_TIMEOUT;
        break;

      case GrpcStatus.UNAVAILABLE:
        httpStatus = HttpStatus.SERVICE_UNAVAILABLE;
        break;

      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message,
      error: 'GrpcError',
    });
  }
}