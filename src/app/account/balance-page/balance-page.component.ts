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
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-balance-page',
  templateUrl: './balance-page.component.html',
  styleUrls: ['./balance-page.component.scss']
})
export class BalancePageComponent implements OnInit {
  displayedColumns: string[] = ['created', 'description', 'receivable', 'received', 'balance'];
  dataSource: MatTableDataSource<IMerchantPaymentData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  onDestroy$ = new Subject();

  receivables;
  payments;
  lang = environment.language;

  constructor(
    private router: Router,
    private accountSvc: AccountService,
    private transactionSvc: TransactionService
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrentAccount().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      if (account && this.accountSvc.isMerchantAdmin(account)) {
        this.reload(account.merchantAccountId);
      } else {
        this.router.navigate(['account/login']);
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



  reload(merchantAccountId: string) {
    this.transactionSvc.getMerchantBalance(merchantAccountId, this.lang).pipe(takeUntil(this.onDestroy$)).subscribe((list: any[]) => {
      let balance = 0;

      list.map(item => {
        if (item.type === 'credit') {
          balance += item.receivable;
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
