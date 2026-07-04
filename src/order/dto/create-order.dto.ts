import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'Product/Item ID',
  })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity',
  })
  @IsInt()
  @Min(1)
  qty: number;

  @ApiProperty({
    example: 499.99,
    description: 'Unit price',
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: 101,
    description: 'User ID',
  })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Order items',
    example: [
      {
        productId: 1,
        qty: 2,
        price: 499.99,
      },
      {
        productId: 2,
        qty: 1,
        price: 999.99,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}