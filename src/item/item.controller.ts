import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(
    private readonly service: ItemService,
  ) {}

  @Get()
  getAll() {
    return this.service.getItems();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.service.getItem(+id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.createItem(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: any,
  ) {
    return this.service.updateItem({
      id: +id,
      ...dto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.deleteItem(+id);
  }
}