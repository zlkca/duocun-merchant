import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { OrderService } from '../../order/order.service';
import { SharedService } from '../../shared/shared.service';
import { IOrderItem, IOrder, OrderStatus } from '../order.model';
// import { SocketService } from '../../shared/socket.service';
import { IMerchant, IPhase } from '../../restaurant/restaurant.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() merchants: IMerchant[];
  merchant;

  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();
  loading = false;
  lang = environment.language;

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private categorySvc: CategoryService
  ) {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    const self = this;
    if (this.merchants && this.merchants.length > 0) {
      if (!this.loading) {
        this.loading = true;
        self.reload(this.merchants);
      }
    } else {
      self.orders = [];
    }

    // this.socketSvc.on('updateOrders', x => {
    //   // self.onFilterOrders(this.selectedRange);
    //   if (x.clientId === self.account.id) {
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

    this.categorySvc.find().pipe(takeUntil(this.onDestroy$)).subscribe((cats: any[]) => {
      this.orderSvc.find(qOrder).pipe(takeUntil(this.onDestroy$)).subscribe(orders => {
        const merchant = merchants[0];
        merchant.phases.map((phase: IPhase) => {
          phase.orders = [];
        });

        orders.map((order: IOrder) => {
          order.items.map(item => {
            if (environment.language === 'en') {
              item.productName = item.product.nameEN;
              item.product.name = item.product.nameEN;
            }
            const cat = cats.find(c => c._id === item.product.categoryId);
            item.product.category = cat;
          });
        });

        merchant.phases.map((phase: IPhase) => {
          phase.orders = orders.filter(o => this.sharedSvc.isSameTime(o.delivered, phase.pickup));
          phase.items = this.getItemList(phase.orders);
          phase.ordersWithNote = this.getNoteList(phase.orders);
        });

        self.merchant = merchant;
        self.loading = false;
      });
    });
  }

  getCategoryName(item) {
    return this.lang !== 'en' ? item.product.category.name : item.product.category.nameEN;
  }

  getNoteList(orders) {
    const ordersWithNote = [];

    orders.map(order => {
      const noteItems = [];

      order.items.map(item => {
        const product = item.product;

        if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
          noteItems.push(item);
        }
      });

      if (order.note) {
        ordersWithNote.push({ note: order.note, items: noteItems });
      }
    });

    return ordersWithNote;
  }

  getItemList(orders: IOrder[]) {
    const list: IOrderItem[] = [];
    orders.map((order: IOrder) => {
      order.items.map((item: IOrderItem) => {
        const it = list.find(x => x.productId === item.productId);
        if (it) {
          it.quantity = it.quantity + item.quantity;
        } else {
          if (item.product && item.product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
            list.push(Object.assign({}, item));
          }
        }
      });
    });
    return list;
  }



  ngOnChanges(v) {
    if (v.merchants && v.merchants.currentValue) {
      const merchants = v.merchants.currentValue;
      this.loading = true;
      this.reload(merchants);
    }
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }
}
