export class ItemDto {
  id: number;

  name: string;

  description?: string;

  sku: string;

  price: number;

  createdAt?: Date;

  updatedAt?: Date;
}