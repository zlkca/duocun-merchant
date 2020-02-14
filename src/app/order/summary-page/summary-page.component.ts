import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { IAccount, Role } from '../../account/account.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IMerchant } from '../../restaurant/restaurant.model';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { Action, ILog, AccountType } from '../../log/log.model';
import { LogService } from '../../log/log.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit, OnDestroy {
  account: IAccount;
  onDestroy$ = new Subject();
  merchants: IMerchant[];

  constructor(
    private merchantSvc: RestaurantService,
    private sharedSvc: SharedService,
    private accountSvc: AccountService,
    private logSvc: LogService
  ) {
  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
      if (this.accountSvc.isMerchantAdmin(account)) {
        const merchantAccountId = account.merchantAccountId;
        const d: any = { // ILog
          accountId: account._id,
          // merchantId: merchantId,
          merchantAccountId: account.merchantAccountId,
          type: AccountType.MERCHANT,
          action: Action.VIEW_ORDER
        };
        self.logSvc.save(d).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
          self.merchantSvc.getByAccountId(merchantAccountId).pipe(takeUntil(this.onDestroy$)).subscribe((ms: IMerchant[]) => {
            self.merchants = ms;
          });
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
