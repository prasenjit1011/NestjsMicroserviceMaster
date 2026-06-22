import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {

  private products = [
    { id: 1, name: 'Laptop', price: 50000 },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find(
      product => product.id === id,
    );
  }

  create(product: any) {
    const newProduct = {
      id: Date.now(),
      ...product,
    };

    this.products.push(newProduct);

    return newProduct;
  }

  update(id: number, body: any) {
    const index = this.products.findIndex(
      p => p.id === id,
    );

    this.products[index] = {
      ...this.products[index],
      ...body,
    };

    return this.products[index];
  }

  remove(id: number) {
    this.products = this.products.filter(
      p => p.id !== id,
    );

    return {
      message: 'Deleted Successfully',
    };
  }
}