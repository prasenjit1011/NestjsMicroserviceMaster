import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';

@Module({
  imports: [ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}







// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { join } from 'path';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// import { ItemController } from './item/item.controller';
// import { ItemService } from './item/item.service';

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: 'ITEM_PACKAGE',
//         transport: Transport.GRPC,
//         options: {
//           url: 'localhost:50051',
//           package: 'item',
//           protoPath: join(__dirname, 'grpc/item.proto'),
//         },
//       },
//     ]),
//   ],
//   controllers: [
//     AppController,
//     ItemController,
//   ],
//   providers: [
//     AppService,
//     ItemService,
//   ],
// })
// export class AppModule {}


// import { Module } from '@nestjs/common';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ItemModule } from './item/item.module';

// @Module({
//   imports: [ItemModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}