import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../guards/auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { Public } from '../decorators/public.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect all routes by default
@UseInterceptors(LoggingInterceptor)
export class ProductsController {
  
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // Public Route
  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Protected Route
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.findOne(id);
  }

  // Protected Route
  @Roles('ADMIN')
  @Post()
  create(
    @Body() body: CreateProductDto,
  ) {
    return this.productsService.create(body);
  }

  // Protected Route
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  // Protected Route
  @Roles('ADMIN')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.remove(id);
  }
}