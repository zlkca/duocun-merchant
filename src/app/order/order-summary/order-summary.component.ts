import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { OrderService } from '../../order/order.service';
import { SharedService } from '../../shared/shared.service';
import { IOrderItem, IOrder } from '../order.model';
// import { SocketService } from '../../shared/socket.service';
import { IRestaurant, IPhase } from '../../restaurant/restaurant.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import * as moment from 'moment';
import { ProductService } from '../../product/product.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() restaurant: IRestaurant;

  orders: IOrder[] = [];
  list: IOrderItem[];
  ordersWithNote: IOrder[] = [];
  onDestroy$ = new Subject();

  constructor(
    private orderSvc: OrderService,
    private productSvc: ProductService,
    private sharedSvc: SharedService,
  ) {

  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    const self = this;
    if (this.restaurant) {
      self.reload(this.restaurant);
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

  reload(merchant: IRestaurant) {
    const self = this;
    const query = {
      merchantId: merchant._id,
      delivered: { $lt: moment().endOf('day').toISOString(), $gt: moment().startOf('day').toISOString() },
      status: { $nin: ['del', 'tmp'] }
    };
    this.orderSvc.find(query).pipe(takeUntil(this.onDestroy$)).subscribe(orders => {
      merchant.phases.map((phase: IPhase) => {
        phase.orders = [];
      });

      // const list = [];
      // const ordersWithNote = [];

      orders.map((order: IOrder) => {
        // const noteItems = [];
        if (environment.language === 'en') {
          order.items.map(item => {
            item.productName = item.product.nameEN;
            item.product.name = item.product.nameEN;
          });
        }
        // order.items.map(item => {
        //   const it = list.find(x => x.product._id === item.product._id);
        //   const product = item.product;

        //   if (it) {
        //     it.quantity = it.quantity + item.quantity;
        //   } else {
        //     if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
        //       list.push(item);
        //     }
        //   }
        //   if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
        //     noteItems.push(item);
        //   }
        // });

        // if (order.note) {
        //   ordersWithNote.push({note: order.note, items: noteItems});
        // }
      });

      merchant.phases.map((phase: IPhase) => {
        phase.orders = orders.filter(o => this.sharedSvc.isSameTime(o.delivered, phase.pickup));

        phase.items = this.getItemList(phase.orders);
        phase.ordersWithNote = this.getNoteList(phase.orders);
      });

      // self.list = list;
      // self.ordersWithNote = ordersWithNote;
      // self.orders = orders;

      self.restaurant = merchant;
      console.log(self.restaurant);
    });
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

  getItemList(orders) {
    let list = [];
    orders.map(order => {
      // order.items.map(item => {
      //   const it = list.find(x => x.productId === item.product._id);
      //   if (it) {
      //     it.quantity = it.quantity + item.quantity;
      //   } else {
      //     if (item.product && item.product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
      //       list.push(item);
      //     }
      //   }
        // if (product && product.categoryId !== '5cbc5df61f85de03fd9e1f12') { // not drink
        //   noteItems.push(item);
        // }
      // });
      list = [...list, ...order.items.filter(item => item.product && item.product.categoryId !== '5cbc5df61f85de03fd9e1f12')];
    });
    return list;
  }



  ngOnChanges(v) {
    if (v.restaurant && v.restaurant.currentValue) {
      const restaurant = v.restaurant.currentValue;
      this.reload(restaurant);
    }
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

  getSingleDesc(item): string {
    if (!item.spec || !item.spec.length) {
      return '';
    }
    const singleSpecNames = [];
    item.spec.filter(spec => spec.type === 'single' && spec.list && spec.list.length).forEach(spec => {
      singleSpecNames.push(spec.list[0].name);
    });
    return singleSpecNames.join(', ');
  }

  getMultipleDesc(item): Array<{name: string, quantity: number}> {
    if (!item.spec || !item.spec.length) {
        return [];
    }
    const multipleDesc = [];
    item.spec.filter(spec => spec.type === 'multiple' && spec.list && spec.list.length).forEach(spec => {
      spec.list.forEach(specDetail => {
        multipleDesc.push({
          name: specDetail.name,
          quantity: specDetail.quantity
        });
      });
    });
    return multipleDesc;
  }


  isSameType(itOne, itTwo): boolean {
    if (itOne.product._id !== itTwo.product._id) {
      return false;
    }
    if (itOne.spec === itTwo.spec) {
      return true;
    }
    if ((!itOne.spec || !itOne.spec.length) && (!itTwo.spec || !itTwo.spec.length)) {
      return true;
    }
    const itOneSingleSpec = itOne.spec.filter(spec => spec.type === 'single');
    const itTwoSingleSpec = itTwo.spec.filter(spec => spec.type === 'single');

    if (!itOneSingleSpec.length !== !itTwoSingleSpec.length) {
      return false;
    }
    for (let i = 0; i < itOneSingleSpec.length; i++) {
      const twoSingleSpec = itTwoSingleSpec.find(spec => spec.specName === itOne.spec[i].specName);
      if (!twoSingleSpec) {
        return false;
      }
      if (itOne.spec[i].list[0].name !== twoSingleSpec.list[0].name) {
        return false;
      }
    }
    return true;
  }

  groupBySingleSpec(items): Array<{productName: string, singleDesc: string, quantity: number}> {
    const list = [];
    if (!items) {
      return list;
    }
    items.forEach(item => {
      const sameKind = list.find(pushed => this.isSameType(pushed, item));
      if (sameKind) {
        sameKind.quantity += item.quantity;
      } else {
        list.push({
          ...item,
          productName: item.product.name,
          singleDesc: this.getSingleDesc(item),
          quantity: item.quantity
        });
      }
    });
    return list;
  }

  groupByMultipleDesc(items): Array<{name: string, quantity: number}> {
    if (!items || !items.length) {
      return [];
    }
    const multipleDesc = [];
    items.forEach(item => {
      const itemMultipleDesc = this.getMultipleDesc(item);
      itemMultipleDesc.forEach(desc => {
        const pushed = multipleDesc.find(p => p.name === desc.name);
        if (pushed) {
          pushed.quantity += desc.quantity * item.quantity;
        } else {
          multipleDesc.push({
            name: desc.name,
            quantity: desc.quantity * item.quantity
          });
        }
      });
    });
    return multipleDesc;
  }

  sortByProduct(items) {
    return items.sort((i, j) => {
      if (i.product.name > j.product.name) {
        return 1;
      } else if (i.product.name === j.product.name) {
        return 0;
      } else {
        return -1;
      }
    });
  }

}
