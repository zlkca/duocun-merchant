import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { IMerchant, IPhase } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem, OrderStatus } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-order-pack',
  templateUrl: './order-pack.component.html',
  styleUrls: ['./order-pack.component.scss']
})
export class OrderPackComponent implements OnInit, OnChanges, OnDestroy {
  @Input() merchants: IMerchant[];
  merchant;

  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();
  lang = environment.language;

  constructor(
    private orderSvc: OrderService,
    private categorySvc: CategoryService,
    private sharedSvc: SharedService
  ) {

  }

  ngOnInit() {
    const self = this;
    if (this.merchants && this.merchants.length > 0) {
      self.reload(this.merchants);
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

  reload(merchants: IMerchant[]) {
    const self = this;

    const standard = moment().set({ hour: 19, minute: 0, second: 0, millisecond: 0 });

    const dt = moment().isAfter(standard) ? moment().add(1, 'day') : moment();
    const dt1 = dt.set({ hour: 11, minute: 20, second: 0, millisecond: 0 }).toISOString();
    const dt2 = dt.set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toISOString();
    const merchantIds = [];
    merchants.map(m => { merchantIds.push(m._id); });
    const qOrder = {
      merchantId: { $in: merchantIds },
      delivered: { $in: [dt1, dt2] },
      status: { $nin: [OrderStatus.DELETED, OrderStatus.TEMP] }
    };

    self.categorySvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((cats: any[]) => {
      self.orderSvc.find(qOrder).pipe(takeUntil(this.onDestroy$)).subscribe((orders: IOrder[]) => {
        const merchant = merchants[0];
        merchant.phases.map((phase: IPhase) => {
          phase.orders = [];
        });

        orders.map((order: IOrder) => {
          const list = [];
          order.items.map(item => {
            const product = item.product;
            if (environment.language === 'en') {
              item.productName = item.product.nameEN;
              item.product.name = item.product.nameEN;
            }

            const cat = cats.find(c => c._id === item.product.categoryId);
            item.product.category = cat;

            if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
              list.push(item);
            }
          });
          order.items = list;
        });

        merchant.phases.map(phase => {
          phase.orders = orders.filter(o => this.sharedSvc.isSameTime(o.delivered, phase.pickup));
        });

        this.merchant = merchant;
      });
    });
  }

  getCategoryName(item) {
    return this.lang !== 'en' ? item.product.category.name : item.product.category.nameEN;
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

  ngOnChanges(v) {
    if (v.merchants && v.merchants.currentValue) {
      const merchants = v.merchants.currentValue;
      this.reload(merchants);
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
