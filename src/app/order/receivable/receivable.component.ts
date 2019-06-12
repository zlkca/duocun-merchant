import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { PaymentService } from '../../payment/payment.service';
import { AccountService } from '../../account/account.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Role } from '../../account/account.model';
import { IMerchantPayment } from '../../payment/payment.model';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { Restaurant } from '../../restaurant/restaurant.model';
import * as moment from 'moment';

@Component({
  selector: 'app-receivable',
  templateUrl: './receivable.component.html',
  styleUrls: ['./receivable.component.scss']
})
export class ReceivableComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  credits: IMerchantPayment[];
  account;
  debits: IMerchantPayment[];
  @Input() restaurant: Restaurant;

  constructor(
    private accountSvc: AccountService,
    private merchantPaymentSvc: PaymentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    const self = this;
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      this.account = account;
      if (account && account.roles) {
        const roles = account.roles;
        if (roles && roles.length > 0 && roles.indexOf(Role.MERCHANT_ADMIN) !== -1) {
          self.reload();
        }
      } else {

      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  reload() {
    const self = this;

    self.merchantPaymentSvc.find({
      where: {
        merchantId: self.restaurant.id,
        type: 'debit',
        status: { $in: ['sent', 'confirmed'] }
      }
    }).pipe(takeUntil(this.onDestroy$)).subscribe(ds => {
      self.debits = ds;

      self.merchantPaymentSvc.find({ where: {
        merchantId: self.restaurant.id,
        type: 'credit'
      }}).pipe(takeUntil(this.onDestroy$)).subscribe(cs => {
        cs.map(c => {
          const debit = ds.find(x => x.merchantId === c.merchantId && x.delivered === c.delivered);
          if (debit) {
            if (debit.amount >= c.amount) {
              c.status = debit.status;
            }
          }
        });

        self.credits = cs.sort((a: IMerchantPayment, b: IMerchantPayment) => {
          if (moment(a.delivered).isAfter(moment(b.delivered))) {
            return -1;
          } else {
            return 1;
          }
        });

      });

    });
  }

  togglePaid(e, item: IMerchantPayment) {
    const self = this;
    const amount = item.amount;

    const debit: IMerchantPayment = {
      status: 'confirmed',
      modified: new Date(),
    };

    const credit: IMerchantPayment = {
      accountId: this.account.id,
      accountName: this.account.username,
      status: 'confirmed',
      modified: new Date(),
    };
    // update debit status from 'send' to 'confirmed';
    // update credit accountId, status from 'new' to 'confirmed' and modified date

    this.merchantPaymentSvc.update(
      {merchantId: item.merchantId, type: 'debit', delivered: item.delivered}, debit).pipe(takeUntil(this.onDestroy$)).subscribe(x => {

      self.merchantPaymentSvc.update(
        {merchantId: item.merchantId, type: 'credit', delivered: item.delivered}, credit).pipe(takeUntil(this.onDestroy$)).subscribe(y => {
          this.snackBar.open('', '已确认付款', { duration: 2300 });
          this.reload();
      });
    });


  }
}

