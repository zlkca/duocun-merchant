import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IAccount } from '../../account/account.model';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import { MatDatepickerInputEvent, MatSnackBar } from '../../../../node_modules/@angular/material';
import * as moment from 'moment';
import { AccountService } from '../../account/account.service';
import { IPayment } from '../../payment/payment.model';
import { PaymentService } from '../../payment/payment.service';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit, OnDestroy {
  @Input() type;
  @Input() restaurant: Restaurant;

  list: any[] = [];
  ordersWithNote: IOrder[] = [];
  total = 0;
  onDestroy$ = new Subject();
  products = [];
  dateForm;
  dateRange;
  paymentForm;
  account;

  paid = false;

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private productSvc: ProductService,
    private accountSvc: AccountService,
    private paymentSvc: PaymentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dateForm = this.fb.group({ date: [''] });

    this.paymentForm = this.fb.group({
      received: [0]
    });

    const self = this;
    self.accountSvc.getCurrent().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(account => {
      self.account = account;
      // self.assignmentSvc.find({where: {driverId: account.id}}).pipe(takeUntil(self.onDestroy$)).subscribe(xs => {
      //   self.assignments = xs;
      //   self.reload(xs);
      // });
    });
  }

  get date() { return this.dateForm.get('date'); }

  // ngOnInit() {
  //   // set defaut date to today and reload orders
  //   const now = moment();
  //   this.deliverTime = now.set({ hour: 11, minute: 45, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
  //   this.range = this.getDateRange(now);
  //   this.reload(this.range);
  //   this.date.setValue(now);
  // }

  onDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    const startDate = moment(event.value);
    this.date.setValue(startDate);

    if (this.type === 'day') {
      const dayStart = moment(event.value).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      const dayEnd = moment(event.value).set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toDate();
      this.dateRange = { $lt: dayEnd, $gt: dayStart };
      this.reload(this.restaurant.id, this.dateRange);
    } else if (this.type === 'week') {
      const dayStart = moment(event.value).startOf('week').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      const dayEnd = moment(event.value).endOf('week').set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toDate();
      this.dateRange = { $lt: dayEnd, $gt: dayStart };
      this.reload(this.restaurant.id, this.dateRange);
    } else if (this.type === 'month') {
      const dayStart = moment(event.value).startOf('month').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      const dayEnd = moment(event.value).endOf('month').set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toDate();
      this.dateRange = { $lt: dayEnd, $gt: dayStart };
      this.reload(this.restaurant.id, this.dateRange);
    }

    // this.deliverTime = startDate.set({ hour: 11, minute: 45, second: 0, millisecond: 0 }).format('YYYY-MM-DD HH:mm:ss');
    // this.range = this.getDateRange(startDate);
    // this.reload(this.restaurant.id, this.dateRange);
  }

  getDateRangeForNow(type) {
    if (this.type === 'day') {
      const dayStart = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      const dayEnd = moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toDate();
      return { $lt: dayEnd, $gt: dayStart };
    } else if (this.type === 'week') {
      const dayStart = moment().startOf('week').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      const dayEnd = moment().endOf('week').set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toDate();
      return { $lt: dayEnd, $gt: dayStart };
    } else if (this.type === 'month') {
      const dayStart = moment().startOf('month').set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate();
      const dayEnd = moment().endOf('month').set({ hour: 23, minute: 59, second: 59, millisecond: 0 }).toDate();
      return { $lt: dayEnd, $gt: dayStart };
    }

    // if (now.isAfter(dayEnd)) {
    //   this.deliverTime = this.sharedSvc.getStartOf('day').add(1, 'days')
    //     .set({ hour: 11, minute: 45, second: 0, millisecond: 0 })
    //     .format('YYYY-MM-DD HH:mm:ss');
    // } else {
    //   this.deliverTime = this.sharedSvc.getStartOf('day')
    //     .set({ hour: 11, minute: 45, second: 0, millisecond: 0 })
    //     .format('YYYY-MM-DD HH:mm:ss');
    // }
  }


  ngOnInit() {
    const self = this;
    const now = moment();
    this.date.setValue(now);

    this.productSvc.find({ where: { merchantId: this.restaurant.id } }).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((products: IProduct[]) => {
      self.products = products;
      self.dateRange = self.getDateRangeForNow(self.type);
      if (self.restaurant) {
        self.reload(self.restaurant.id, self.dateRange);
      } else {
        self.list = [];
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

  // ngOnChanges(v) {
  //   if (v.restaurant && v.restaurant.currentValue) {
  //     const restaurant = v.restaurant.currentValue;
  //     // this.reload(restaurant.id);
  //   }
  // }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  reload(merchantId: string, dateRange) {
    const self = this;
    self.orderSvc.find({ where: { merchantId: merchantId, delivered: dateRange } }).pipe(
      takeUntil(self.onDestroy$)
    ).subscribe(orders => {
      const productList = [];
      orders.map((order: IOrder) => {
        order.items.map(item => {
          const p = productList.find(x => x.productId === item.productId);
          if (p) {
            p.quantity = p.quantity + item.quantity;
          } else {
            productList.push(Object.assign({}, item));
          }
        });
      });

      self.list = productList;
      self.total = 0;
      self.list.map(it => {
        const p = self.products.find(x => x.id === it.productId);
        if (p) {
          it.cost = p.cost;
          it.total = it.cost * it.quantity;
          self.total += it.total;
        }
      });
    });
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }



  togglePaid(e) {
    const self = this;
    const data = {
      status: e.checked ? 'paid' : 'unpaid',
      driverId: this.account.id,
      driverName: this.account.username
    };
    // this.pay.update({ id: order.id }, data).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
    //   if (x && x.ok) {
    //     this.snackBar.open('', '已完成客户' + order.clientName + '的订单', { duration: 2300 });
    //     // setTimeout(() => {
    //     //   this.reload(self.assignments);
    //     // }, 2000);
    //   }
    // });

    // this.updateBalance();
  }


  // updateBalance() {
  //   const received = parseFloat(this.paymentForm.get('received').value);

  //   const payment: IPayment = {
  //     merchantId: this.restaurant.id,
  //     merchantName: this.restaurant.name,
  //     receiverId: this.account.id,
  //     receiverName: this.account.username,
  //     credit: received,
  //     debit: this.total,
  //     balance: received - this.total,
  //     delivered: this.dateRange['$gt'],
  //     created: new Date(),
  //     modified: new Date(),
  //   };

  //   this.paymentSvc.save(payment).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
  //     this.snackBar.open('', '已保存余额', { duration: 2300 });
  //   });
  // }
}
