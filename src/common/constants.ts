import { join } from 'path';

export const GRPC = {
  ITEM_PACKAGE: 'item',
  ITEM_SERVICE: 'ItemService',
  ITEM_CLIENT: 'ITEM_PACKAGE',
  ITEM_URL: process.env.ITEM_GRPC_URL || '127.0.0.1:50051',
  ITEM_PROTO_PATH: join(__dirname, '../proto/item.proto'),

  ORDER_PACKAGE: 'order',
  ORDER_SERVICE: 'OrderService',
  ORDER_CLIENT: 'ORDER_PACKAGE',
  ORDER_URL: process.env.ORDER_GRPC_URL || '127.0.0.1:50052',
  ORDER_PROTO_PATH: join(__dirname, '../proto/order.proto'),  
};