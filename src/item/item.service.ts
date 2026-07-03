import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
  ) {}

  // ------------------------
  // CREATE
  // ------------------------
  async create(createItemDto: CreateItemDto) {
    try {
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
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ------------------------
  // GET ALL (PAGINATION FIXED)
  // ------------------------
  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const result = await this.itemRepository.findAll(
      skip,
      limit,
      search,
    );

    return {
      success: true,
      message: 'Items fetched successfully.',
      data: result.data,
      meta: {
        total: result.total,
        page,
        limit,
        lastPage: Math.ceil(result.total / limit),
      },
    };
  }

  // ------------------------
  // GET ONE
  // ------------------------
  async findOne(id: number) {
    const item = await this.itemRepository.findOne(id);

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found.`);
    }

    return {
      success: true,
      data: item,
    };

  }

  // ------------------------
  // UPDATE
  // ------------------------
  async update(id: number, updateItemDto: UpdateItemDto) {
    await this.findOne(id);

    try {
      return await this.itemRepository.update(id, {
        name: updateItemDto.name,
        description: updateItemDto.description,
        sku: updateItemDto.sku,
        price: updateItemDto.price,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ------------------------
  // DELETE
  // ------------------------
  async delete(id: number) {
    await this.findOne(id);

    try {
      await this.itemRepository.delete(id);

      return {
        success: true,
        message: 'Item deleted successfully',
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // ------------------------
  // ERROR HANDLER
  // ------------------------
  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new RpcException({
            code: status.ALREADY_EXISTS,
            message: 'SKU already exists.',
          });

        case 'P2025':
          throw new RpcException({
            code: status.NOT_FOUND,
            message: 'Record not found.',
          });

        default:
          throw new RpcException({
            code: status.INTERNAL,
            message: `Database error (${error.code})`,
          });
      }
    }

    throw new RpcException({
      code: status.INTERNAL,
      message: 'Internal server error.',
    });
  }
}