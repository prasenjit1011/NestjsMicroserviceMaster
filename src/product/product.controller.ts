// product/product.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private productService: ProductService,
  ) {}

  @Get()
  @Render('product-list')
  list() {
    return {
      products:
        this.productService.getProducts(),
    };
  }

  @Get('/add')
  @Render('product-add')
  addPage(@Req() req, @Res() res) {
    if (
      req.session.user.role !== 'admin'
    ) {
      return res.send('Access Denied');
    }

    return {};
  }

  @Post('/add')
  add(
    @Body() body,
    @Req() req,
    @Res() res,
  ) {
    if (
      req.session.user.role !== 'admin'
    ) {
      return res.send('Access Denied');
    }

    const products =
      this.productService.getProducts();

    products.push({
      id: Date.now(),
      name: body.name,
      price: body.price,
    });

    this.productService.saveProducts(
      products,
    );

    return res.redirect('/products');
  }

  @Get('/edit/:id')
  @Render('product-edit')
  editPage(
    @Param('id') id: string,
  ) {
    const products =
      this.productService.getProducts();

    const product = products.find(
      (x) => x.id == Number(id),
    );

    return { product };
  }

  @Post('/edit/:id')
  edit(
    @Param('id') id: string,
    @Body() body,
    @Res() res,
  ) {
    const products =
      this.productService.getProducts();

    const index = products.findIndex(
      (x) => x.id == Number(id),
    );

    products[index].name = body.name;
    products[index].price = body.price;

    this.productService.saveProducts(
      products,
    );

    return res.redirect('/products');
  }

  @Get('/delete/:id')
  delete(
    @Param('id') id: string,
    @Req() req,
    @Res() res,
  ) {
    if (
      req.session.user.role !== 'admin'
    ) {
      return res.send('Access Denied');
    }

    let products =
      this.productService.getProducts();

    products = products.filter(
      (x) => x.id != Number(id),
    );

    this.productService.saveProducts(
      products,
    );

    return res.redirect('/products');
  }
}