import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface ArticleGrpcService {
  getHello(data: {}): Observable<any>;
  GetArticleList(data: {}): Observable<any>;
  /*
  getItems(data: {}): Observable<any>;
  getItem(data: { id: number }): Observable<any>;
  createItem(data: any): Observable<any>;
  updateItem(data: any): Observable<any>;
  deleteItem(data: { id: number }): Observable<any>;
  */
}

@Injectable()
export class ArticleService implements OnModuleInit {
  private service: ArticleGrpcService;

  constructor(
    @Inject('ARTICLE_PACKAGE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<ArticleGrpcService>('ArticleService');
  }

  getHello() {
    return this.service.getHello({});
    // return this.service.getItems({});
  }

  getArticles() {
    return this.service.GetArticleList({});
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