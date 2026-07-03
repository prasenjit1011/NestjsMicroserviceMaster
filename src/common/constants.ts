import { join } from 'path';

export const GRPC = {
  ITEM_PACKAGE: 'item',
  ITEM_SERVICE: 'ItemService',
  ITEM_CLIENT: 'ITEM_PACKAGE',

  URL: process.env.ITEM_GRPC_URL || '127.0.0.1:50051',

  PROTO_PATH: join(process.cwd(), 'src/grpc/item.proto'),
};