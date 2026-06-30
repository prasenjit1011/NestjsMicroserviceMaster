import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('Brand CRUD')
@ApiBearerAuth()
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // ADMIN only
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateBrandDto) {
    return this.brandService.create(dto);
  }

  // Public Route
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  // Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  // CUSTOMER only
  @Put(':id')
  @Roles(Role.CUSTOMER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    return this.brandService.update(+id, dto);
  }

  // ADMIN only
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}