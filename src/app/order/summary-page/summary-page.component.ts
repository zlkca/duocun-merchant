import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { OrderService } from '../../order/order.service';
import { SharedService } from '../../shared/shared.service';
import { Order, IOrderItem, IOrder } from '../order.model';
import { SocketService } from '../../shared/socket.service';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { IAccount } from '../../account/account.model';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {
  account: IAccount;
  rangeToday;
  rangeTomorrow;
  rangeAfterTomorrow;
  constructor(
    private accountSvc: AccountService,
    private sharedSvc: SharedService,
  ) {
    const todayStart = this.sharedSvc.getStartOf('day').toDate();
    const todayEnd = this.sharedSvc.getEndOf('day').toDate();
    const tomorrowStart = this.sharedSvc.getStartOf('day').add(1).toDate();
    const tomorrowEnd = this.sharedSvc.getEndOf('day').add(1).toDate();
    const afterTomorrowStart = this.sharedSvc.getStartOf('day').add(2).toDate();
    const afterTomorrowEnd = this.sharedSvc.getEndOf('day').add(2).toDate();

    this.rangeToday = { $lt: todayEnd, $gt: todayStart};
    this.rangeTomorrow = { $lt: tomorrowEnd, $gt: tomorrowStart};
    this.rangeAfterTomorrow = { $lt: afterTomorrowEnd, $gt: afterTomorrowStart};
  }
  ngOnInit() {
    const self = this;
    this.accountSvc.getCurrent().subscribe((account: IAccount) => {
      self.account = account;
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

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
