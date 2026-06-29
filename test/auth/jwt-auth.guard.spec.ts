// test/auth/jwt-auth.guard.spec.ts

import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should allow public routes', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(true),
    };

    guard = new JwtAuthGuard(
      reflector as any,
    );

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(
      guard.canActivate(context),
    ).toBe(true);
  });

  it('should call super.canActivate for protected routes', () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(false),
    };

    guard = new JwtAuthGuard(
      reflector as any,
    );

    const superSpy = jest
      .spyOn(
        Object.getPrototypeOf(
          Object.getPrototypeOf(guard),
        ),
        'canActivate',
      )
      .mockReturnValue(true);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(
      guard.canActivate(context),
    ).toBe(true);

    expect(superSpy).toHaveBeenCalled();
  });
});