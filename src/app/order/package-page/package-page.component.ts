import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAccount, Role } from '../../account/account.model';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { Subject } from '../../../../node_modules/rxjs';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-package-page',
  templateUrl: './package-page.component.html',
  styleUrls: ['./package-page.component.scss']
})
export class PackagePageComponent implements OnInit, OnDestroy {

  account: IAccount;
  range;
  now;
  lunchEnd;
  deliverTime;
  onDestroy$ = new Subject();
  restaurant: IRestaurant;

  constructor(
    private restaurantSvc: RestaurantService,
    private sharedSvc: SharedService,
    private accountSvc: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const now = this.sharedSvc.getNow();
    const dayEnd = this.sharedSvc.getStartOf('day').set({ hour: 19, minute: 30, second: 0, millisecond: 0 });

    if (now.isAfter(dayEnd)) {
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
    self.accountSvc.getCurrent().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(account => {
        const roles = account.roles;
        if (roles && roles.length > 0 && roles.indexOf(Role.MERCHANT_ADMIN) !== -1
          && account.merchants && account.merchants.length > 0
        ) {
          const merchantId = account.merchants[0];
          self.restaurantSvc.find({ where: { id: merchantId } }).pipe(
            takeUntil(this.onDestroy$)
          ).subscribe((rs: IRestaurant[]) => {
            if (rs && rs.length > 0) {
              self.restaurant = rs[0];
            } else {
              self.restaurant = null;
            }
          });
        } else { // not authorized for opreration merchant
          this.router.navigate(['account/settings'], { queryParams: { merchant: false } });
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
