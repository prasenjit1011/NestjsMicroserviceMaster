import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './product-create.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    readonly name?: string;
    readonly price?: number;
    readonly description?: string;
  }
  