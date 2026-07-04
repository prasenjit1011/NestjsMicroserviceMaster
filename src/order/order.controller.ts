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

import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';

import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('Order CRUD')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Post()
  // Remove this if normal users should create orders
  // @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({
    summary: 'Create Order',
    description: 'Create a new order.',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  create(
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.create(dto);
  }

  @Get()
  // @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get Orders',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully.',
  })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    console.log('page:', page, 'limit:', limit, 'search:', search);
    return this.orderService.findAll(
      Number(page),
      Number(limit),
      search,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Order By Id',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully.',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    console.log('Retrieving order with ID:', id);
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update Order',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiBody({
    type: UpdateOrderDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully.',
  })
  update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete Order',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully.',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.orderService.remove(id);
  }
}