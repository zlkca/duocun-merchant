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

  reload(merchantId: string) {
    const q = { merchantId: merchantId, status: { $nin: ['del', 'tmp'] } };
    const qTransaction = { type: 'debit', toId: merchantId };
    this.orderSvc.quickFind(q).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
      this.transactionSvc.quickFind(qTransaction).pipe(takeUntil(this.onDestroy$)).subscribe((ts: ITransaction[]) => {
        let list = [];
        let balance = 0;
        os.map(order => {
          const totalCost = order.cost;
          const item = list.find(it => moment(it.date).isSame(order.delivered), 'day');
          if (item) {
            item.paid += totalCost;
          } else {
            list.push({ date: order.delivered, description: order.merchantName,
              type: 'credit', paid: totalCost, received: 0, balance: 0 });
          }
        });

        ts.map(t => {
          // const item = list.find(l => moment(l.date).isSame(moment(t.created), 'day'));
          // if (item) {
          //   item.received = t.amount;
          // } else {
            list.push({ date: t.created, description: '', type: t.type, paid: 0, received: t.amount, balance: 0 });
          // }
        });

        list = list.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          const bMoment = moment(b.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          if (aMoment.isAfter(bMoment)) {
            return 1; // b at top
          } else if (bMoment.isAfter(aMoment)) {
            return -1;
          } else {
            if (a.type === 'debit' && b.type === 'credit') {
              return 1;
            } else {
              return -1;
            }
          }
        });

        list.map(item => {
          balance += item.paid;
          balance -= item.received;
          item.balance = balance;
        });

        const myList = list.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          const bMoment = moment(b.date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
          if (aMoment.isAfter(bMoment)) {
            return -1; // b at top
          } else if (bMoment.isAfter(aMoment)) {
            return 1;
          } else {
            if (a.type === 'debit' && b.type === 'credit') {
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
