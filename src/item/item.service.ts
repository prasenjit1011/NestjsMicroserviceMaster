import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  // CREATE
  async create(createItemDto: CreateItemDto) {
    const item = await this.itemRepository.create({
      name: createItemDto.name,
      description: createItemDto.description,
      sku: createItemDto.sku,
      price: createItemDto.price,
    });

    return {
      success: true,
      message: 'Item created successfully',
      data: item,
    };
  }


  // GET ALL
  async findAll() {
    const items = await this.itemRepository.findAll();

    return {
      success: true,
      message: 'Items fetched successfully',
      data: items,
      total: items.length,
    };
  }



  // GET ONE
  async findOne(id: number) {
    const item = await this.itemRepository.findOne(id);

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return item;
  }

  // UPDATE
  async update(id: number, updateItemDto: UpdateItemDto) {
    await this.findOne(id);

    return this.itemRepository.update(id, {
      name: updateItemDto.name,
      description: updateItemDto.description,
      sku: updateItemDto.sku,
    });
  }

  // DELETE
  async delete(id: number) {
    await this.findOne(id);

    await this.itemRepository.delete(id);

    return {
      success: true,
      message: 'Item deleted successfully',
    };
  }


}