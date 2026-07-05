// auth.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from './users';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateUser(username: string, password: string) {
    const user = users.find(
      (u) =>
        u.username === username &&
        u.password === password,
    );

    if (!user) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}