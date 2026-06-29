import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/products/products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [ProductsService],
      }).compile();

    service =
      module.get<ProductsService>(
        ProductsService,
      );
  });

  it('should return all products', () => {
    expect(service.findAll()).toHaveLength(1);
  });

  it('should return one product', () => {
    expect(service.findOne(1)).toEqual({
      id: 1,
      name: 'Laptop',
      price: 50000,
    });
  });

  it('should create a product', () => {
    const product = service.create({
      name: 'Mobile',
      price: 20000,
    });

    expect(product.name).toBe('Mobile');
    expect(service.findAll()).toHaveLength(2);
  });

  it('should update product', () => {
    const updated = service.update(1, {
      price: 60000,
    });

    expect(updated.price).toBe(60000);
  });

  it('should delete product', () => {
    const result = service.remove(1);

    expect(result.message).toBe(
      'Deleted Successfully',
    );

    expect(service.findAll()).toHaveLength(0);
  });
});