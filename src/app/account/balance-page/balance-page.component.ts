import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { IMerchantPaymentData } from '../../payment/payment.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { AccountService } from '../../account/account.service';
import { Role } from '../../account/account.model';
import * as moment from 'moment';
import { TransactionService } from '../../transaction/transaction.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-balance-page',
  templateUrl: './balance-page.component.html',
  styleUrls: ['./balance-page.component.scss']
})
export class BalancePageComponent implements OnInit {
  displayedColumns: string[] = ['created', 'description', 'paid', 'received', 'balance'];
  dataSource: MatTableDataSource<IMerchantPaymentData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  onDestroy$ = new Subject();

  receivables;
  payments;
  lang = environment.language;

  constructor(
    private accountSvc: AccountService,
    private transactionSvc: TransactionService
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
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

  groupByDelivered(items) {
    const groups = {};
    items.map(it => {
      let delivered = null;
      if (it.hasOwnProperty('delivered')) {
        delivered = moment(it.delivered);
        const dt = Object.keys(groups).find(x => moment(x).isSame(delivered, 'day'));
        if (dt) {
          groups[dt].push(it);
        } else {
          groups[delivered.toISOString()] = [it];
        }
      } else {
        console.log('No delivered Transaction:' + it._id);
      }
    });
    return groups;
  }

  getDescription(t, merchantAccountId) {
    if (t.items && t.items.length > 0) {
      if (environment.language === 'en') {
        return 'client cancel order';
      } else {
        return '客户撤销订单';
      }
    } else {
      return t.toId === merchantAccountId ? t.fromName : t.toName;
    }
  }

  reload(merchantAccountId: string) {
    const qCredit = {
      fromId: merchantAccountId
    };

    const qDebit = {
      toId: merchantAccountId
    };

    this.transactionSvc.quickFind(qCredit).pipe(takeUntil(this.onDestroy$)).subscribe(credits => {
      this.transactionSvc.quickFind(qDebit).pipe(takeUntil(this.onDestroy$)).subscribe(debits => {
        let list = [];
        let balance = 0;
        const receivables = this.groupByDelivered(credits);
        Object.keys(receivables).map(dt => {
          const its = receivables[dt];
          let amount = 0;
          its.map(it => { amount += it.amount; });
          list.push({ created: dt, description: '', type: 'credit', paid: amount, received: 0, balance: 0, items: null });
        });

        debits.map(t => {
          const description = this.getDescription(t, merchantAccountId);
          list.push({
            created: t.created, description: description, type: 'debit', paid: 0, received: t.amount, balance: 0,
            items: t.items ? t.items : null
          });
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
    });
  }
}
