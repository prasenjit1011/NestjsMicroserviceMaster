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
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Item CRUD')
@ApiBearerAuth()
@Controller('items')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
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
    return JSON.stringify({id:123,mg:"created successfully!"});
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
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