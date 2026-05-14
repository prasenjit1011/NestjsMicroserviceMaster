// auth/role.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RoleGuard
  implements CanActivate
{
  constructor(private role: string) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context
      .switchToHttp()
      .getRequest();

    return (
      request.session.user?.role === this.role
    );
  }
}