import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;

    if (token !== 'Bearer secret123') {
      throw new UnauthorizedException(
        'Invalid Token',
      );
    }

    return true;
  }
}