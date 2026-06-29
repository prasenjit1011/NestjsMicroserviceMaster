// test/interceptors/logging.interceptor.spec.ts

import { of } from 'rxjs';
import { LoggingInterceptor } from '../../src/interceptors/logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log before and after controller execution', done => {
    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation();

    const context = {} as any;

    const next = {
      handle: jest.fn(() => of('test response')),
    };

    interceptor
      .intercept(context, next)
      .subscribe(result => {
        expect(result).toBe('test response');

        // First log
        expect(logSpy).toHaveBeenCalledWith(
          'Before Controller',
        );

        // Second log
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            'After Controller',
          ),
        );

        done();
      });
  });

  it('should call next.handle()', done => {
    const handleSpy = jest.fn(() =>
      of('success'),
    );

    const next = {
      handle: handleSpy,
    };

    interceptor
      .intercept({} as any, next)
      .subscribe(() => {
        expect(handleSpy).toHaveBeenCalled();
        done();
      });
  });
});