import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import * as moment from 'moment';

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
    private sharedSvc: SharedService
  ) {

  }

  ngOnInit() {
    const self = this;
    if (this.restaurant) {
      self.reload(this.restaurant);
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

  reload(merchant: IRestaurant) {
    const self = this;
    const now = moment();
    const todayEnd = moment().set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
    let delivered = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    if (now.isAfter(todayEnd)) {
      delivered = moment().add(1, 'day').set({ hour: 11, minute: 45, second: 0, millisecond: 0 });
    }

    const query = {
      merchantId: merchant._id,
      delivered: delivered.toISOString(), // { $lt: moment().endOf('day').toDate(), $gt: moment().startOf('day').toDate() },
      status: { $nin: ['del', 'tmp'] }
    };

    self.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
      orders.filter(x => x.merchant._id === merchant._id).map(order => {
        const list = [];
        order.items.map(item => {
          const product = item.product;
          if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
            list.push(item);
          }
        });
        order.items = list;
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
      this.reload(restaurant);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
