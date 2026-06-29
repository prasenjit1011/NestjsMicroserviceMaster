import { NestFactory } from '@nestjs/core';
import { bootstrap } from '../src/main';
import { AppModule } from '../src/app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('Main Bootstrap', () => {
  let mockApp: any;

  beforeEach(() => {
    process.env.PORT = '3001';

    mockApp = {
      listen: jest.fn().mockResolvedValue(undefined),
      useGlobalPipes: jest.fn(),
    };

    (NestFactory.create as jest.Mock)
      .mockResolvedValue(mockApp);

    jest.spyOn(console, 'log')
      .mockImplementation(() => {});

    jest.spyOn(console, 'clear')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should bootstrap application', async () => {
    await bootstrap();

    expect(NestFactory.create)
      .toHaveBeenCalledWith(AppModule);

    expect(mockApp.useGlobalPipes)
      .toHaveBeenCalled();

    expect(mockApp.listen)
      .toHaveBeenCalledWith('3001');

    expect(console.clear)
      .toHaveBeenCalled();
  });
});