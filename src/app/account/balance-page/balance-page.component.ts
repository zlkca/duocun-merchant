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
  displayedColumns: string[] = ['created', 'paid', 'received', 'balance'];
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

  groupBySameDay(items, key) {
    const groups = {};
    items.map(it => {
      let date = null;
      if (it.hasOwnProperty('delivered')) {
        date = moment(it.delivered).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      } else {
        date = moment(it[key]).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      }
      const dt = Object.keys(groups).find(x => moment(x).isSame(date, 'day'));

      if (dt) {
        groups[dt].push(it);
      } else {
        groups[date.toISOString()] = [it];
      }
    });

    return groups;
  }

  reload(merchantId: string) {
    const q = {
      '$or': [{ fromId: merchantId }, { toId: merchantId }],
      status: { $ne: 'del' },
      action: { $ne: 'duocun cancel order from merchant' }
    };
    this.transactionSvc.quickFind(q).pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
      let list = [];
      let balance = 0;
      const credits = ts.filter(t => t.fromId === merchantId);
      const debits = ts.filter(t => t.toId === merchantId);
      const receivables = this.groupBySameDay(credits, 'created');
      Object.keys(receivables).map(dt => {
        const its = receivables[dt];
        let amount = 0;
        its.map(it => { amount += it.amount; });
        list.push({ created: dt, description: '', type: 'credit', paid: amount, received: 0, balance: 0 });
      });

      debits.map(t => {
        const description = t.fromId === merchantId ? t.toName : t.fromName;
        list.push({ created: t.created, description: description, type: 'debit', paid: 0, received: t.amount, balance: 0 });
      });

      list = list.sort((a: any, b: any) => {
        const aMoment = moment(a.created);
        const bMoment = moment(b.created);
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

      const rows = list.sort((a: any, b: any) => {
        const aMoment = moment(a.created);
        const bMoment = moment(b.created);
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

      this.dataSource = new MatTableDataSource(rows);
      this.dataSource.sort = this.sort;
    });
  }
}
