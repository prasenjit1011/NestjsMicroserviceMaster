export interface CreateOrderItemDto {
  id: number;
  productId: number;
  qty: number;
  price: number;
}

export interface CreateOrderDto {
  userId: number;
  items: CreateOrderItemDto[];
}