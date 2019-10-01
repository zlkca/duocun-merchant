import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import * as moment from 'moment';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';

@Component({
  selector: 'app-order-pack',
  templateUrl: './order-pack.component.html',
  styleUrls: ['./order-pack.component.scss']
})
export class OrderPackComponent implements OnInit, OnChanges, OnDestroy {
  @Input() restaurant: IRestaurant;

  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();

  constructor(
    private orderSvc: OrderService,
    private productSvc: ProductService,
    private sharedSvc: SharedService
  ) {

  }

  ngOnInit() {
    const self = this;
    if (this.restaurant) {
      self.reload(this.restaurant.id);
    } else {
      self.orders = [];
    }

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

  reload(merchantId: string) {
    const self = this;
    const query = {
      merchantId: merchantId,
      delivered: { $lt: moment().endOf('day').toDate(), $gt: moment().startOf('day').toDate() },
      status: { $nin: ['del', 'tmp'] }
    };

    self.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
      self.productSvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((products: IProduct[]) => {
        orders.map(order => {
          const list = [];
          order.items.map(item => {
            const product = products.find(x => x.id === item.productId);
            item.productName = product.nameEn;
            if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
              list.push(item);
            }
          });
          order.items = list;
        });
        self.orders = orders;
      });
    });
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

  ngOnChanges(v) {
    if (v.restaurant && v.restaurant.currentValue) {
      const restaurant = v.restaurant.currentValue;
      this.reload(restaurant.id);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
