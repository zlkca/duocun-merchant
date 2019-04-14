import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { OrderService } from '../../order/order.service';
import { SharedService } from '../../shared/shared.service';
import { Order, IOrderItem, IOrder } from '../order.model';
import { SocketService } from '../../shared/socket.service';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { IAccount } from '../../account/account.model';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  @Input() account: IAccount;
  @Input() dateRange;

  restaurant: Restaurant;
  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];

  constructor(
    private accountSvc: AccountService,
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private restaurantSvc: RestaurantService,
  ) {

  }
  ngOnInit() {
    const self = this;
    // this.accountSvc.getCurrent().subscribe((account: IAccount) => {
    const account = this.account;
      if (account && account.id) {
        self.restaurantSvc.find({ where: { ownerId: account.id } }).subscribe((rs: IRestaurant[]) => {
          if (rs && rs.length > 0) {
            self.reload(rs[0].id);
          } else {
            self.orders = [];
          }
        });
      } else {
        // should never be here.
        self.orders = [];
      }
    // });

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
    self.orderSvc.find({ where: {
      merchantId: merchantId,
      delivered: self.dateRange
      // delivered: { $lt: self.sharedSvc.getNextDayStart(1), $gt: self.sharedSvc.getTodayStart()}
      // delivered: { $lt: self.sharedSvc.getNextDayStart(2), $gt: self.sharedSvc.getNextDayStart(1)}
     } }).subscribe(orders => {
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

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
