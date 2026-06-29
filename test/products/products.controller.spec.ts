import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../../src/products/products.controller';
import { ProductsService } from '../../src/products/products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockService = {
    findAll: jest.fn(() => [
      {
        id: 1,
        name: 'Laptop',
        price: 50000,
      },
    ]),

    findOne: jest.fn((id) => ({
      id,
      name: 'Laptop',
      price: 50000,
    })),

    create: jest.fn((dto) => dto),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),

    remove: jest.fn(() => ({
      message: 'Deleted Successfully',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ProductsController],
        providers: [
          {
            provide: ProductsService,
            useValue: mockService,
          },
        ],
      }).compile();

    controller =
      module.get<ProductsController>(
        ProductsController,
      );
  });

  it('should return all products', () => {
    expect(controller.findAll()).toHaveLength(
      1,
    );
  });

  it('should return one product', () => {
    expect(
      controller.findOne(1),
    ).toHaveProperty('id', 1);
  });

  it('should create product', () => {
    const dto = {
      name: 'TV',
      price: 30000,
    };

    expect(
      controller.create(dto),
    ).toEqual(dto);
  });

  it('should update product', () => {
    const dto = { price: 70000 };

    expect(
      controller.update(1, dto),
    ).toEqual({
      id: 1,
      price: 70000,
    });
  });

  it('should delete product', () => {
    expect(
      controller.remove(1),
    ).toEqual({
      message: 'Deleted Successfully',
    });
  });
});