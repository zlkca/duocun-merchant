import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { IAccount, Role } from '../../account/account.model';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IMerchant } from '../../restaurant/restaurant.model';
import { RestaurantService } from '../../restaurant/restaurant.service';
import * as moment from 'moment';
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
  restaurant: IMerchant;

  constructor(
    private merchantSvc: RestaurantService,
    private sharedSvc: SharedService,
    private accountSvc: AccountService,
    private logSvc: LogService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      if (this.accountSvc.isMerchantAdmin(account) && account.merchants && account.merchants.length > 0) {
        const merchantId = account.merchants[0];
        const d: any = { // ILog
          accountId: account._id,
          merchantId: merchantId,
          type: AccountType.MERCHANT,
          action: Action.VIEW_ORDER
        };
        self.logSvc.save(d).pipe(takeUntil(this.onDestroy$)).subscribe(() => {
          self.merchantSvc.find({ _id: merchantId }).pipe(takeUntil(this.onDestroy$)).subscribe((rs: IMerchant[]) => {
            if (rs && rs.length > 0) {
              self.restaurant = rs[0];
            } else {
              self.restaurant = null;
            }
          });
        });
      } else {

      }
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
