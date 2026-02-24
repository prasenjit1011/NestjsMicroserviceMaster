// src/product/product.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product-create.dto';
import { UpdateProductDto } from './product-update.dto';
import { Product } from './product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(){
    const data = {
      name:'myproductlist',
      url: process.env.PRODUCT_QUEUE_URL
    }
    //return data;
    return this.productService.findAll();
  }

  @Get('myprod')
  findMyProd(){
    return this.productService.myProd();
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {

    const dtd  = (new Date);
    const time = dtd.getDate()+'-'+dtd.getHours()+'-'+dtd.getMinutes()+'-'+dtd.getSeconds()+'-'+dtd.getMilliseconds();
    const updDto = {"description":"Dummy "+time}
    await this.productService.update(id, updDto);

    return this.productService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Product> {
    return this.productService.remove(id);
  }
}
