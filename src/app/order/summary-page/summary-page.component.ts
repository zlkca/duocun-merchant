import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../../shared/shared.service';
import { IAccount } from '../../account/account.model';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { RestaurantService } from '../../restaurant/restaurant.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss']
})
export class SummaryPageComponent implements OnInit, OnDestroy {
  account: IAccount;
  range;
  deliverTime;
  onDestroy$ = new Subject();
  restaurant: IRestaurant;

  constructor(
    private restaurantSvc: RestaurantService,
    private sharedSvc: SharedService,
    private route: ActivatedRoute
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

    self.route.params.pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(params => {
      const merchantId = params['id'];
      self.restaurantSvc.find({ where: { id: merchantId } }).pipe(
        takeUntil(this.onDestroy$)
      ).subscribe((rs: IRestaurant[]) => {
        if (rs && rs.length > 0) {
          self.restaurant = rs[0];
        } else {
          self.restaurant = null;
        }
      });
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
