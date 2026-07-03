import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    example: 'Samsung Galaxy S25',
    description: 'Item name',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Latest Samsung Mobile',
    description: 'Item description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'SAM-S25-001',
    description: 'Unique SKU',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    example: 79999,
    description: 'Item price',
  })
  @IsNumber()
  price: number;
}