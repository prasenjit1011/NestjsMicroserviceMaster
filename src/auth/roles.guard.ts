import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Public route
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Read token from HttpOnly cookie
    const token = request.cookies?.token;

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: 'mySecretKey',
      });

      // Optional: attach user to request
      request.user = payload;

      return requiredRoles.includes(payload.role);
    } catch (error) {
      return false;
    }
  }
}