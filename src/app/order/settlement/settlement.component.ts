import { Component, OnInit, Input } from '@angular/core';
import { IAccount } from '../../account/account.model';
import { Restaurant, IRestaurant } from '../../restaurant/restaurant.model';
import { IOrder, IOrderItem } from '../order.model';
import { OrderService } from '../order.service';
import { SharedService } from '../../shared/shared.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { ProductService } from '../../product/product.service';
import { IProduct } from '../../product/product.model';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss']
})
export class SettlementComponent implements OnInit {

  @Input() account: IAccount;
  @Input() dateRange;

  restaurant: Restaurant;
  list: any[] = [];
  ordersWithNote: IOrder[] = [];
  total = 0;

  constructor(
    private orderSvc: OrderService,
    private sharedSvc: SharedService,
    private restaurantSvc: RestaurantService,
    private productSvc: ProductService
  ) {

  }
  ngOnInit() {
    const self = this;
    const account = this.account;
    if (account && account.id) {
      self.restaurantSvc.find({ where: { ownerId: account.id } }).subscribe((rs: IRestaurant[]) => {
        if (rs && rs.length > 0) {
          self.reload(rs[0].id);
        } else {
          self.list = [];
        }
      });
    } else {
      // should never be here.
      self.list = [];
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
    self.orderSvc.find({ where: { merchantId: merchantId, delivered: self.dateRange }}).subscribe(orders => {
      const list = [];
      orders.map((order: IOrder) => {
        order.items.map(item => {
          const p = list.find(x => x.productId === item.productId);
          if (p) {
            p.quantity = p.quantity + item.quantity;
          } else {
            list.push(item);
          }
        });
      });

      self.list = list;
      self.total = 0;
      self.productSvc.find({ where: { merchantId: merchantId}}).subscribe((products: IProduct[]) => {
        self.list.map( it => {
          const p = products.find(x => x.id === it.productId);
          if (p) {
            it.cost = p.cost;
            it.total = it.cost * it.quantity;
            self.total += it.total;
          }
        });
      });
    });
  }

  onSelect(c) {
    // this.select.emit({ order: c });
  }

  toDateTimeString(s) {
    return s ? this.sharedSvc.toDateTimeString(s) : '';
  }

}
