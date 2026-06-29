import { LoggerMiddleware } from '../../src/middleware/logger.middleware';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
  });

  it('should call next()', () => {
    const req = {
      method: 'GET',
      originalUrl: '/products',
    };

    const res = {};

    const next = jest.fn();

    middleware.use(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});