import {
  Injectable,
  Inject,
  OnModuleInit,
} from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface ItemGrpcService {
  getHello(data: {}): Observable<any>;
  /*
  getItems(data: {}): Observable<any>;

  getItem(data: { id: number }): Observable<any>;

  createItem(data: any): Observable<any>;

  updateItem(data: any): Observable<any>;

  deleteItem(data: { id: number }): Observable<any>;
  */
}


@Injectable()
export class ItemService implements OnModuleInit {
  private service: ItemGrpcService;

  constructor(
    @Inject('ITEM_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<ItemGrpcService>('ItemService');
  }

  getItems() {
    return this.service.getHello({});
    // return this.service.getItems({});
  }

  /*
  getItem(id: number) {
    return this.service.getItem({ id });
  }

  createItem(dto: any) {
    return this.service.createItem(dto);
  }

  updateItem(dto: any) {
    return this.service.updateItem(dto);
  }

  deleteItem(id: number) {
    return this.service.deleteItem({ id });
  }
  */
}