import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { OrderService } from '../../order/order.service';
import { SharedService } from '../../shared/shared.service';
import { IOrderItem, IOrder } from '../order.model';
// import { SocketService } from '../../shared/socket.service';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import * as moment from 'moment';
import { ProductService } from '../../product/product.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() restaurant: IRestaurant;

  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();

  constructor(
    private orderSvc: OrderService,
    private productSvc: ProductService,
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
    const delivered = moment().set({ hour: 11, minute: 45, second: 0, millisecond: 0 }); // fix me
    const query = {
      merchantId: merchant._id,
      delivered: delivered.toISOString(), // { $lt: moment().endOf('day').toDate(), $gt: moment().startOf('day').toDate() },
      status: { $nin: ['del', 'tmp'] }
    };

    this.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe(orders => {
      const list = [];
      const ordersWithNote = [];
        orders.map((order: IOrder) => {

          const noteItems = [];

          order.items.map(item => {
            const it = list.find(x => x.product._id === item.product._id);
            const product = item.product;
            if (it) {
              it.quantity = it.quantity + item.quantity;
            } else {
              product.name = product.nameEn;
              if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
                list.push(item);
              }
            }
            if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
              noteItems.push(item);
            }
          });

          if (order.note) {
            ordersWithNote.push({note: order.note, items: noteItems});
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
      this.reload(restaurant);
    }
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
