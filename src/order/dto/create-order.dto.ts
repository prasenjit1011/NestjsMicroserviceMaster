export interface CreateOrderItemDto {
  productId: number;
  qty: number;
  price: number;
}

export interface CreateOrderDto {
  userId: number;
  items: CreateOrderItemDto[];
}