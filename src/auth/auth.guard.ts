import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context
      .switchToHttp()
      .getRequest();
    const response = context
      .switchToHttp()
      .getResponse();

    if (!request.session?.user) {
      response.redirect('http://localhost:3000');
      return false;
    }

    return true;
  }
}