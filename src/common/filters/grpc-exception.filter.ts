import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { status as GrpcStatus } from '@grpc/grpc-js';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const grpcCode = exception?.code;
    const message =
      exception?.details ||
      exception?.message ||
      'Unknown error';

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (grpcCode) {
      case GrpcStatus.ALREADY_EXISTS:
        httpStatus = HttpStatus.CONFLICT;
        break;

      case GrpcStatus.NOT_FOUND:
        httpStatus = HttpStatus.NOT_FOUND;
        break;

      case GrpcStatus.INVALID_ARGUMENT:
        httpStatus = HttpStatus.BAD_REQUEST;
        break;

      case GrpcStatus.UNAUTHENTICATED:
        httpStatus = HttpStatus.UNAUTHORIZED;
        break;

      case GrpcStatus.PERMISSION_DENIED:
        httpStatus = HttpStatus.FORBIDDEN;
        break;
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message,
      error: 'GrpcError',
    });
  }
}