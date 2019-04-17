import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { IAccount } from '../../account/account.model';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit {
  account: IAccount;
  range;
  deliverTime;

  constructor(
    private accountSvc: AccountService,
    private sharedSvc: SharedService,
  ) {
    const now = this.sharedSvc.getNow();
    const lunchEnd = this.sharedSvc.getStartOf('day').set({ hour: 13, minute: 30, second: 0, millisecond: 0 });

    if (now.isAfter(lunchEnd)) {
      this.deliverTime = this.sharedSvc.getStartOf('day').add(1, 'days')
        .set({ hour: 11, minute: 45, second: 0, millisecond: 0 })
        .format('YYYY-MM-DD HH:mm:ss');

      const tomorrowStart = this.sharedSvc.getStartOf('day').add(1, 'days').toDate();
      const tomorrowEnd = this.sharedSvc.getEndOf('day').add(1, 'days').toDate();
      this.range = { $lt: tomorrowEnd, $gt: tomorrowStart };
    } else {
      this.deliverTime = this.sharedSvc.getStartOf('day')
        .set({ hour: 11, minute: 45, second: 0, millisecond: 0 })
        .format('YYYY-MM-DD HH:mm:ss');

      const todayStart = this.sharedSvc.getStartOf('day').toDate();
      const todayEnd = this.sharedSvc.getEndOf('day').toDate();
      this.range = { $lt: todayEnd, $gt: todayStart };
    }
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
