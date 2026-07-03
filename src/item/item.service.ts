import {
  Injectable,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { GRPC } from '../common/constants';
import { CreateItemDto, UpdateItemDto } from './dto';

interface ItemGrpcService {
  CreateItem(data: CreateItemDto): Observable<any>;

  GetItems(data: {
    page: number;
    limit: number;
    search: string;
  }): Observable<any>;

  GetItemById(data: {
    id: number;
  }): Observable<any>;

  UpdateItem(
    data: UpdateItemDto & {
      id: number;
    },
  ): Observable<any>;

  DeleteItem(data: {
    id: number;
  }): Observable<any>;
}

@Injectable()
export class ItemService implements OnModuleInit {
  private itemGrpcService: ItemGrpcService;

  constructor(
    @Inject(GRPC.ITEM_CLIENT)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.itemGrpcService =
      this.client.getService<ItemGrpcService>(
        GRPC.ITEM_SERVICE,
      );
  }

  create(dto: CreateItemDto) {
    return this.itemGrpcService.CreateItem(dto);
  }

  findAll(
    page = 1,
    limit = 10,
    search = '',
  ) {
    return this.itemGrpcService.GetItems({
      page,
      limit,
      search,
    });
  }

  findOne(id: number) {
    return this.itemGrpcService.GetItemById({
      id,
    });
  }

  update(
    id: number,
    dto: UpdateItemDto,
  ) {
    return this.itemGrpcService.UpdateItem({
      id,
      ...dto,
    });
  }

  remove(id: number) {
    return this.itemGrpcService.DeleteItem({
      id,
    });
  }
}