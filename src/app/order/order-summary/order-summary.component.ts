import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { OrderService } from '../../order/order.service';
import { SharedService } from '../../shared/shared.service';
import { IOrderItem, IOrder } from '../order.model';
// import { SocketService } from '../../shared/socket.service';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() restaurant: IRestaurant;
  @Input() dateRange;

  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
  ) {

  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
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
    self.orderSvc.find({
      where: {
        merchantId: merchantId,
        delivered: self.dateRange
        // delivered: { $lt: self.sharedSvc.getNextDayStart(1), $gt: self.sharedSvc.getTodayStart()}
        // delivered: { $lt: self.sharedSvc.getNextDayStart(2), $gt: self.sharedSvc.getNextDayStart(1)}
      }
    }).pipe(
      takeUntil(self.onDestroy$)
    ).subscribe(orders => {
      // orders.sort((a: Order, b: Order) => {
      //   if (this.sharedSvc.compareDateTime(a.created, b.created)) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // });
      const list = [];
      const ordersWithNote = [];
      orders.map((order: IOrder) => {
        order.items.map(item => {
          const p = list.find(x => x.productId === item.productId);
          if (p) {
            p.quantity = p.quantity + item.quantity;
          } else {
            list.push(item);
          }
        });

        if (order.note) {
          ordersWithNote.push(order);
        }
      });

      self.list = list;
      self.ordersWithNote = ordersWithNote;
      self.orders = orders;
    });
  }

  ngOnChanges(v) {
    if (v.restaurant && v.restaurant.currentValue) {
      const restaurant = v.restaurant.currentValue;
      this.reload(restaurant.id);
    }
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
