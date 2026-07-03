import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@ApiTags('Item CRUD')
@ApiBearerAuth()
@Controller('items')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create Item',
    description: 'Creates a new item.',
  })
  @ApiBody({
    type: CreateItemDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Item created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  create(
    @Body() dto: CreateItemDto,
  ) {
    return this.itemService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Items',
    description: 'Returns paginated list of items.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Records per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'Samsung',
    description: 'Search by item name',
  })
  @ApiResponse({
    status: 200,
    description: 'Items retrieved successfully.',
  })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    return this.itemService.findAll(
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Item By Id',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Item ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Item retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found.',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.itemService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Item',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdateItemDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found.',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateItemDto,
  ) {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Item',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Item deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found.',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.itemService.remove(id);
  }
}