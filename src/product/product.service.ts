// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './product-create.dto';
import { UpdateProductDto } from './product-update.dto';
import { Product } from './product.schema';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  myProd(){
    return this.productRepository.myProd();
  }

  findOne(id: string): Promise<Product> {
    return this.productRepository.findOne(id);
  }

  update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: string): Promise<Product> {
    return this.productRepository.remove(id);
  }
}
