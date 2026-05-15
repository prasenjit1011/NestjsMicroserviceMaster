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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(
            process.cwd(),
            'src',
            'public',
            'product_img',
          );
          fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(
            null,
            `product-${uniqueSuffix}${path.extname(
              file.originalname,
            )}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif/;
        const isAllowedMime = allowed.test(file.mimetype);
        const isAllowedExt = allowed.test(
          path.extname(file.originalname).toLowerCase(),
        );
        cb(null, isAllowedMime && isAllowedExt);
      },
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  add(
    @Body() body,
    @UploadedFile() image: Express.Multer.File,
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
      image: image
        ? `/product_img/${image.filename}`
        : null,
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