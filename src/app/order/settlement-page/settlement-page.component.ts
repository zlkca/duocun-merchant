import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAccount, Role } from '../../account/account.model';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { Router } from '../../../../node_modules/@angular/router';
import { IMerchant } from '../../restaurant/restaurant.model';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { AccountType } from '../../log/log.model';

@Component({
  selector: 'app-settlement-page',
  templateUrl: './settlement-page.component.html',
  styleUrls: ['./settlement-page.component.scss']
})
export class SettlementPageComponent implements OnInit, OnDestroy {

  account: IAccount;
  rangeDay;
  rangeWeek;
  rangeMonth;
  onDestroy$ = new Subject();
  merchants: IMerchant[];
  deliverTime;

  constructor(
    private merchantSvc: RestaurantService,
    private sharedSvc: SharedService,
    private accountSvc: AccountService,
    private router: Router
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
      if (this.accountSvc.isMerchantAdmin(account)) {
        const merchantAccountId = account.merchantAccountId;
        self.merchantSvc.getByAccountId(merchantAccountId).pipe(takeUntil(this.onDestroy$)).subscribe((ms: IMerchant[]) => {
          self.merchants = ms;
        });
      } else {
        self.merchants = [];
      }
    });

    // this.socketSvc.on('updateOrders', x => {
    //   // self.onFilterOrders(this.selectedRange);
    //   if (x.clientId === self.account.id) {
    //   }
    // });
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

}
