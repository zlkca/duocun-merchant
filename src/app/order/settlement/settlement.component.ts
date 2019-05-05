import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IAccount } from '../../account/account.model';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit, OnDestroy {
  @Input() dateRange;
  @Input() restaurant: Restaurant;

  list: any[] = [];
  ordersWithNote: IOrder[] = [];
  total = 0;
  onDestroy$ = new Subject();
  products = [];

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private productSvc: ProductService
  ) {

  }

  ngOnInit() {
    const self = this;
    this.productSvc.find({ where: { merchantId: this.restaurant.id}}).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((products: IProduct[]) => {
      self.products = products;

      if (self.restaurant) {
        self.reload(this.restaurant.id);
      } else {
        self.list = [];
      }
    });



    // this.socketSvc.on('updateOrders', x => {
    //   // self.onFilterOrders(this.selectedRange);
    //   if (x.clientId === self.account.id) {
    //     const index = self.orders.findIndex(i => i.id === x.id);
    //     if (index !== -1) {
    //       self.orders[index] = x;
    //     } else {
    //       self.orders.push(x);
    //     }
    //     self.orders.sort((a: Order, b: Order) => {
    //       if (this.sharedSvc.compareDateTime(a.created, b.created)) {
    //         return -1;
    //       } else {
    //         return 1;
    //       }
    //     });
    //   }
    // });
  }

  // ngOnChanges(v) {
  //   if (v.restaurant && v.restaurant.currentValue) {
  //     const restaurant = v.restaurant.currentValue;
  //     // this.reload(restaurant.id);
  //   }
  // }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  reload(merchantId: string) {
    const self = this;
    self.orderSvc.find({ where: { merchantId: merchantId, delivered: self.dateRange }}).pipe(
      takeUntil(self.onDestroy$)
    ).subscribe(orders => {
      const productList = [];
      orders.map((order: IOrder) => {
        order.items.map(item => {
          const p = productList.find(x => x.productId === item.productId);
          if (p) {
            p.quantity = p.quantity + item.quantity;
          } else {
            productList.push(Object.assign({}, item));
          }
        });
      });

      self.list = productList;
      self.total = 0;
      self.list.map( it => {
        const p = self.products.find(x => x.id === it.productId);
        if (p) {
          it.cost = p.cost;
          it.total = it.cost * it.quantity;
          self.total += it.total;
        }
      });
    });
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

}
