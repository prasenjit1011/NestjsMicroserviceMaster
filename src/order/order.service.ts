import {
  Injectable,
  Inject,
  OnModuleInit,
} from '@nestjs/common';

import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface OrderGrpcService {
  getHello(data: {}): Observable<any>;
  /*
  getOrders(data: {}): Observable<any>;

  getOrder(data: { id: number }): Observable<any>;

  createOrder(data: any): Observable<any>;

  updateOrder(data: any): Observable<any>;

  deleteOrder(data: { id: number }): Observable<any>;
  */
}


@Injectable()
export class OrderService implements OnModuleInit {
  private service: OrderGrpcService;

  constructor(
    @Inject('ORDER_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<OrderGrpcService>('OrderService');
  }

  getOrders() {
    return this.service.getHello({});
    // return this.service.getOrders({});
  }

  /*
  getOrder(id: number) {
    return this.service.getOrder({ id });
  }

  createOrder(dto: any) {
    return this.service.createOrder(dto);
  }

  updateOrder(dto: any) {
    return this.service.updateOrder(dto);
  }

  deleteOrder(id: number) {
    return this.service.deleteOrder({ id });
  }
  */
}