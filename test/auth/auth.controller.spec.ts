// test/auth/auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockReturnValue({
      access_token: 'fake-token',
      user: {
        id: 1,
        email: 'admin@test.com',
        role: 'ADMIN',
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService,
          },
        ],
      }).compile();

    controller =
      module.get<AuthController>(AuthController);
  });

  it('should login successfully', () => {
    const dto = {
      email: 'admin@test.com',
      password: 'admin123',
    };

    const result = controller.login(dto);

    expect(result).toHaveProperty(
      'access_token',
    );

    expect(result.user.email).toBe(
      'admin@test.com',
    );
  });
});