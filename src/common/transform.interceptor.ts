import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      if (context.getType<'graphql'>() === 'graphql') {
        return next.handle(); // skip non-GraphQL
      }

      return next.handle().pipe(
        map((data) => ({
          success: true,
          timestamp: new Date().toISOString(),
          data
        })),
      );
    }
  }
  