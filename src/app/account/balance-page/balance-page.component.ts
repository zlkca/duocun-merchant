import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { IMerchantPaymentData } from '../../payment/payment.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { AccountService } from '../../account/account.service';
import { Role } from '../../account/account.model';
import * as moment from 'moment';
import { TransactionService } from '../../transaction/transaction.service';
import { OrderService } from '../../order/order.service';
import { IOrder } from '../../order/order.model';
import { ITransaction } from '../../transaction/transaction.model';

@Component({
  selector: 'app-balance-page',
  templateUrl: './balance-page.component.html',
  styleUrls: ['./balance-page.component.scss']
})
export class BalancePageComponent implements OnInit {
  displayedColumns: string[] = ['date', 'paid', 'received', 'balance'];
  dataSource: MatTableDataSource<IMerchantPaymentData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  onDestroy$ = new Subject();

  receivables;
  payments;

  constructor(
    private accountSvc: AccountService,
    private orderSvc: OrderService,
    private transactionSvc: TransactionService
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentUser().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      const roles = account.roles;
      if (roles && roles.length > 0 && roles.indexOf(Role.MERCHANT_ADMIN) !== -1
        && account.merchants && account.merchants.length > 0
      ) {
        const merchantId = account.merchants[0];

        this.reload(merchantId);
      }
    });
  }

  groupBy(items, key) {
    return items.reduce((result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), {});
  }

  reload(merchantId: string) {
    const q = { merchantId: merchantId, status: { $nin: ['del', 'tmp'] } };
    const qTransaction = { type: 'debit', toId: merchantId };
    this.orderSvc.quickFind(q).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
      this.transactionSvc.quickFind(qTransaction).pipe(takeUntil(this.onDestroy$)).subscribe((ts: ITransaction[]) => {
        let list = [];
        let balance = 0;
        const receivables = this.groupBy(os, 'delivered');
        // const list: IMerchantPaymentData[] = [];
        Object.keys(receivables).map(dt => {
          const orders = receivables[dt];
          let amount = 0;
          orders.map(order => { amount += order.cost; });
          list.push({
            date: dt, description: '', type: 'credit', paid: amount, received: 0, balance: 0
          });
        });

        ts.map(t => { // duocun pay merchant
          list.push({ date: t.created, description: '', type: 'debit', paid: 0, received: t.amount, balance: 0 });
        });

        list = list.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date);
          const bMoment = moment(b.date);
          if (aMoment.isSame(bMoment, 'day')) {
            if (a.type === 'debit') {
              return 1;
            } else {
              if (aMoment.isAfter(bMoment)) {
                return 1; // a to bottom
              } else {
                return -1;
              }
            }
          } else {
            if (aMoment.isAfter(bMoment)) {
              return 1;
            } else {
              return -1;
            }
          }
        });

        list.map(item => {
          if (item.type === 'credit') {
            balance += item.paid;
          } else {
            balance -= item.received;
          }
          item.balance = balance;
        });

        const myList = list.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date);
          const bMoment = moment(b.date);
          if (aMoment.isSame(bMoment, 'day')) {
            if (a.type === 'debit') {
              return -1;
            } else {
              if (aMoment.isAfter(bMoment)) {
                return -1; // a to top
              } else {
                return 1;
              }
            }
          } else {
            if (aMoment.isAfter(bMoment)) {
              return -1;
            } else {
              return 1;
            }
          }
        });

        this.dataSource = new MatTableDataSource(myList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }
}
