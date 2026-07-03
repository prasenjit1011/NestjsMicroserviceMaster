import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @GrpcMethod('ItemService', 'CreateItem')
  async createItem(data: CreateItemDto) {
    return this.itemService.create(data);
  }

  @GrpcMethod('ItemService', 'GetItems')
  async getAllItems() {
    return this.itemService.findAll();
  }

  @GrpcMethod('ItemService', 'GetItemById')
  async getItem(data: { id: number }) {
    return this.itemService.findOne(data.id);
  }

  @GrpcMethod('ItemService', 'UpdateItem')
  async updateItem(data: UpdateItemDto) {
    return this.itemService.update(data.id, data);
  }

  @GrpcMethod('ItemService', 'DeleteItem')
  async deleteItem(data: { id: number }) {
    return this.itemService.delete(data.id);
  }
}