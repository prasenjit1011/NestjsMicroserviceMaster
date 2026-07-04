import {
  Injectable,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { GRPC } from '../common/constants';
import { CreateOrderDto, UpdateOrderDto } from './dto';

interface OrderGrpcService {
  CreateOrder(data: CreateOrderDto): Observable<any>;

  GetOrders(data: {
    page: number;
    limit: number;
    search: string;
  }): Observable<any>;

  GetOrderById(data: {
    id: number;
  }): Observable<any>;

  UpdateOrder(
    data: UpdateOrderDto & {
      id: number;
    },
  ): Observable<any>;

  DeleteOrder(data: {
    id: number;
  }): Observable<any>;
}

@Injectable()
export class OrderService implements OnModuleInit {
  private orderGrpcService: OrderGrpcService;

  constructor(
    @Inject(GRPC.ORDER_CLIENT)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderGrpcService =
      this.client.getService<OrderGrpcService>(
        GRPC.ORDER_SERVICE,
      );
  }

  create(dto: CreateOrderDto) {
    return this.orderGrpcService.CreateOrder(dto);
  }

  findAll(
    page = 1,
    limit = 10,
    search = '',
  ) {
    return this.orderGrpcService.GetOrders({
      page,
      limit,
      search,
    });
  }

  findOne(id: number) {
    return this.orderGrpcService.GetOrderById({
      id,
    });
  }

  update(
    id: number,
    dto: UpdateOrderDto,
  ) {
    return this.orderGrpcService.UpdateOrder({
      id,
      ...dto,
    });
  }

  remove(id: number) {
    return this.orderGrpcService.DeleteOrder({
      id,
    });
  }
}