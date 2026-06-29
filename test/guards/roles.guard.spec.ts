import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../src/guards/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard({
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(['ADMIN']),
    } as any);
  });

  it('should allow ADMIN user', () => {
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'ADMIN' },
        }),
      }),
    } as any;

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('should deny USER role', () => {
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'USER' },
        }),
      }),
    } as any;

    expect(
      guard.canActivate(context),
    ).toBe(false);
  });
});