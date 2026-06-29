import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // In-memory users
  private users = [
    {
      id: 1,
      email: 'admin@test.com',
      password: 'admin123',
      role: 'ADMIN',
    },
    {
      id: 2,
      email: 'user@test.com',
      password: 'user123',
      role: 'USER',
    },
  ];

  login(email: string, password: string) {
    const user = this.users.find(
      u => u.email === email && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}