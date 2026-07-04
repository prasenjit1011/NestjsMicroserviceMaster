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
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Order CRUD')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create Order',
    description: 'Creates a new order.',
  })
  @ApiBody({
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  create(
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Orders',
    description: 'Returns paginated list of orders.',
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
    description: 'Search by order name',
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
    description: 'Order ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
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
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
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
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.orderService.remove(id);
  }
}