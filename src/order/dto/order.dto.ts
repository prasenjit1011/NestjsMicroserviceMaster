export class OrderDto {
  id: number;

  name: string;

  description?: string;

  sku: string;

  price: number;

  createdAt?: Date;

  updatedAt?: Date;
}