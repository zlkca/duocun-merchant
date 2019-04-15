import { Component, OnInit, Input } from '@angular/core';
import { IAccount } from '../../account/account.model';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { RestaurantService } from '../../restaurant/restaurant.service';

@Component({
  selector: 'app-order-pack',
  templateUrl: './order-pack.component.html',
  styleUrls: ['./order-pack.component.scss']
})
export class OrderPackComponent implements OnInit {


  @Input() account: IAccount;
  @Input() dateRange;

  restaurant: Restaurant;
  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private restaurantSvc: RestaurantService,
  ) {

  }
  ngOnInit() {
    const self = this;
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
    self.orderSvc.find({ where: { merchantId: merchantId, delivered: self.dateRange }}).subscribe(orders => {
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
