import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { AssignmentService } from '../../assignment/assignment.service';
import { IAssignment } from '../../assignment/assignment.model';

@Component({
  selector: 'app-order-pack',
  templateUrl: './order-pack.component.html',
  styleUrls: ['./order-pack.component.scss']
})
export class OrderPackComponent implements OnInit, OnChanges, OnDestroy {
  @Input() restaurant: IRestaurant;
  @Input() dateRange;

  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private assignmentSvc: AssignmentService
  ) {

  }
  ngOnInit() {
    const self = this;
    if (this.restaurant) {
      self.reload(this.restaurant.id);
    } else {
      self.orders = [];
    }

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

  reload(merchantId: string) {
    const self = this;
    self.orderSvc.find({ where: { merchantId: merchantId, delivered: self.dateRange } }).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((orders: IOrder[]) => {
      self.assignmentSvc.find({ where: { merchantId: merchantId, delivered: self.dateRange } }).pipe(
        takeUntil(this.onDestroy$)
      ).subscribe(ass => {
        orders.map(order => {
          const assignment: IAssignment = ass.find(y => y.orderId === order.id);
          if (assignment) {
            order.code = assignment.code;
          }
        });
      });
      self.orders = orders;
    });
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

  ngOnChanges(v) {
    if (v.restaurant && v.restaurant.currentValue) {
      const restaurant = v.restaurant.currentValue;
      this.reload(restaurant.id);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
