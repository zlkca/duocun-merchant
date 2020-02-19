import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAccount, Role } from '../../account/account.model';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { IMerchant } from '../../restaurant/restaurant.model';
import { Subject } from '../../../../node_modules/rxjs';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { Router } from '../../../../node_modules/@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { LogService } from '../../log/log.service';
import { Action, AccountType } from '../../log/log.model';

@Component({
  selector: 'app-package-page',
  templateUrl: './package-page.component.html',
  styleUrls: ['./package-page.component.scss']
})
export class PackagePageComponent implements OnInit, OnDestroy {

  account: IAccount;
  onDestroy$ = new Subject();
  merchants: IMerchant[];

  constructor(
    private merchantSvc: RestaurantService,
    private sharedSvc: SharedService,
    private accountSvc: AccountService,
    private logSvc: LogService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
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
      } else { // not authorized for opreration merchant
        this.router.navigate(['account/setting'], { queryParams: { merchant: false } });
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

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
