import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { IPaymentData, IPayment, IMerchantPaymentData } from '../payment.model';
import { PaymentService } from '../payment.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { AccountService } from '../../account/account.service';
import { Role } from '../../account/account.model';
import * as moment from 'moment';
import { TransactionService } from '../../transaction/transaction.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {
  displayedColumns: string[] = ['date', 'receivable', 'paid', 'balance'];
  dataSource: MatTableDataSource<IPaymentData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  onDestroy$ = new Subject();

  receivables;
  payments;

  constructor(
    private paymentSvc: PaymentService,
    private accountSvc: AccountService,
    private transactionSvc: TransactionService
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrent().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(account => {
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
    this.paymentSvc.find({ type: 'credit', merchantId: merchantId }).pipe(takeUntil(this.onDestroy$)).subscribe(receivables => {
      this.transactionSvc.find({ type: 'debit', toId: merchantId }).pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
        const payments: IMerchantPaymentData[] = [];

        receivables.map(p => {
          payments.push({
            date: p.delivered, receivable: p.amount, paid: 0, balance: 0, type: 'credit',
            merchantId: p.merchantId, merchantName: p.merchantName, driverName: p.driverName
          });
        });

        ts.map(t => {
          payments.push({
            date: t.created, receivable: 0, paid: t.amount, balance: 0, type: 'debit',
            merchantId: t.toId, merchantName: t.toName, driverName: t.fromName
          });
        });

        const ps = payments.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date);
          const bMoment = moment(b.date);
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

        let balance = 0;
        ps.map(p => {
          if (p.type === 'credit') {
            balance += p.receivable;
          } else {
            balance -= p.paid;
          }
          p.balance = balance;
        });

        this.payments = ps.sort((a: IMerchantPaymentData, b: IMerchantPaymentData) => {
          const aMoment = moment(a.date);
          const bMoment = moment(b.date);
          if (aMoment.isAfter(bMoment)) {
            return -1;
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

        this.dataSource = new MatTableDataSource(payments);
        this.dataSource.sort = this.sort;
      });
    });
  }

}
