import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { IAccount, Role } from '../../account/account.model';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { RestaurantService } from '../../restaurant/restaurant.service';
import * as moment from 'moment';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit, OnDestroy {
  account: IAccount;
  range;
  deliverDate;
  onDestroy$ = new Subject();
  restaurant: IRestaurant;

  constructor(
    private restaurantSvc: RestaurantService,
    private sharedSvc: SharedService,
    private accountSvc: AccountService,
    private route: ActivatedRoute
  ) {
    this.deliverDate = moment().format('YYYY-MM-DD');
  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      if (this.accountSvc.isMerchantAdmin(account) && account.merchants && account.merchants.length > 0) {
        const merchantId = account.merchants[0];
        self.restaurantSvc.find({ id: merchantId }).pipe(takeUntil(this.onDestroy$)).subscribe((rs: IRestaurant[]) => {
          if (rs && rs.length > 0) {
            self.restaurant = rs[0];
          } else {
            self.restaurant = null;
          }
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
