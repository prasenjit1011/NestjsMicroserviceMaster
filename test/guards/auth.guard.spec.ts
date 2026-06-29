// test/guards/auth.guard.spec.ts

import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../../src/guards/auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow public routes', () => {
    guard = new AuthGuard({
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(true),
    } as any);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('should allow request with valid token', () => {
    guard = new AuthGuard({
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(false),
    } as any);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),

      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization:
              'Bearer secret123',
          },
        }),
      }),
    } as any;

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('should throw UnauthorizedException for invalid token', () => {
    guard = new AuthGuard({
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(false),
    } as any);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),

      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization:
              'Bearer wrong-token',
          },
        }),
      }),
    } as any;

    expect(() =>
      guard.canActivate(context),
    ).toThrow(UnauthorizedException);
  });
});