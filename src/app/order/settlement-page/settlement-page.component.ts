import { Component, OnInit } from '@angular/core';
import { IAccount } from '../../account/account.model';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-settlement-page',
  templateUrl: './settlement-page.component.html',
  styleUrls: ['./settlement-page.component.scss']
})
export class SettlementPageComponent implements OnInit {

  account: IAccount;
  rangeDay;
  rangeWeek;
  rangeMonth;

  constructor(
    private accountSvc: AccountService,
    private sharedSvc: SharedService,
  ) {
    const dayStart = this.sharedSvc.getStartOf('day').toDate();
    const dayEnd = this.sharedSvc.getEndOf('day').toDate();
    const weekStart = this.sharedSvc.getStartOf('week').toDate();
    const weekEnd = this.sharedSvc.getEndOf('week').toDate();
    const monthStart = this.sharedSvc.getStartOf('month').toDate();
    const monthEnd = this.sharedSvc.getEndOf('month').toDate();

    this.rangeDay = { $lt: dayEnd, $gt: dayStart};
    this.rangeWeek = { $lt: weekEnd, $gt: weekStart};
    this.rangeMonth = { $lt: monthEnd, $gt: monthStart};
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
