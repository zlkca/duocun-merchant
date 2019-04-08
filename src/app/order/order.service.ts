
import { throwError as observableThrowError, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, map, mergeMap, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { OrderApi, LoopBackFilter, RestaurantApi, LoopBackConfig } from '../lb-sdk';

import { Restaurant } from '../restaurant/restaurant.model';
import { Order, OrderItem } from '../order/order.model';
import { EntityService } from '../entity.service';
import { AuthService } from '../account/auth.service';

const APP = environment.APP;
const API_URL = environment.API_URL;


@Injectable()
export class OrderService extends EntityService {
  url;

  constructor(
    public authSvc: AuthService,
    public http: HttpClient,
    // private orderApi: OrderApi,
    // private restaurantApi: RestaurantApi
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Orders';
  }

  // save(order: Order): Observable<any> {
  //   return this.http.post(this.url, order);
  // }

  // replace(order: Order): Observable<any> {
  //   return this.http.put(this.url, order);
  // }

  // findRestaurant(id: any, filters: LoopBackFilter): Observable<Restaurant> {
  //   return this.restaurantApi.findById(id, filters);
  // }

  // findById(id: any, filters: LoopBackFilter = {}): Observable<Order> {
  //   return this.orderApi.findById(id, filters);
  // }

  // find(filters: LoopBackFilter = {}): Observable<Order[]> {
  //   return this.orderApi.find(filters);
  // }

  // create(order: Order): Observable<Order> {
  //   return this.orderApi.create(order).pipe(
  //     mergeMap((newOrder: Order) => {
  //       return this.orderApi.createManyItems(newOrder.id, order.items);
  //     }),
  //     mergeMap((items: OrderItem[]) => {
  //       return this.orderApi.findById(items[0].orderId, { include: 'items' });
  //     })
  //   );
  // }

  // replaceById(id: number, order: Order): Observable<Order> {
  //   return this.orderApi.replaceById(id, order);
  // }

  // createMany(orders: Order[]): Observable<Order[]> {
  //   return this.orderApi.createMany(orders);
  // }

  // createManyItems(orderId: number, orderItems: OrderItem[]): Observable<OrderItem[]> {
  //   return this.orderApi.createManyItems(orderId, orderItems);
  // }

  // delivery(order: Order) {
  //   return this.orderApi.patchAttributes(order.id, { status: 'delivered' });
  // }

  // deleteById(id: number): Observable<Order> {
  //   return this.orderApi.deleteById(id);
  // }

  // private API_URL = environment.API_URL;
  // private APP = environment.APP;
  // MEDIA_URL = environment.APP_URL + '/media/';
  // emptyImage = environment.APP_URL + '/media/empty.png';

  // constructor(private http: HttpClient) { }

  // checkout(orders: any, user_id: string): Promise<Order> {
  //     const url = this.API_URL + 'orders';

  //     return this.http.post(url, {
  //         // 'id': (d.id? d.id:''),
  //         'orders': orders, // {pid:x, quantity:number}
  //         'user_id': user_id
  //         // 'created': d.created,
  //         // 'updated': d.updated,
  //     })
  //     .toPromise()
  //     .then((res: any) => {
  //         if (res.success) {
  //             return res.order;
  //         } else {
  //             throw new Error('order create failed');
  //         }
  //     });
  // }

  // getOrderList(query?:string):Observable<Order[]>{
  //     const url = this.API_URL + 'orders' + (query ? query:'');
  //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
  //     return this.http.get(url, {'headers': headers}).pipe(map((res:any) => {
  //         let a:Order[] = [];
  //         if( res.data && res.data.length > 0){
  //             for(let b of res.data){
  //                 a.push(new Order(b));
  //             }
  //         }
  //         return a;
  //     }),
  //     catchError((err) => {
  //         return observableThrowError(err.message || err);
  //     }),);
  // }

  // getOrder(id:number):Observable<Order>{
  //     const url = this.API_URL + 'orders/' + id;
  //     let headers = new HttpHeaders().set('Content-Type', 'application/json');
  //     return this.http.get(url, {'headers': headers}).pipe(map((res:any) => {
  //         return new Order(res.data);
  //     }),
  //     catchError((err) => {
  //         return observableThrowError(err.message || err);
  //     }),);
  // }

}
