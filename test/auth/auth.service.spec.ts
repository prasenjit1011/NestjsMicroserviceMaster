import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn().mockReturnValue('fake-jwt-token'),
            },
          },
        ],
      }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should login successfully', () => {
    const result = service.login(
      'admin@test.com',
      'admin123',
    );

    expect(result).toHaveProperty(
      'access_token',
    );
    expect(result.user.email).toBe(
      'admin@test.com',
    );
  });

  it('should throw UnauthorizedException for invalid credentials', () => {
    expect(() =>
      service.login(
        'wrong@test.com',
        '123',
      ),
    ).toThrow(UnauthorizedException);
  });
});