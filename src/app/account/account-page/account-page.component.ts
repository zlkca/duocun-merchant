import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../account.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { IAccount, Role } from '../account.model';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { IContact, Contact } from '../../contact/contact.model';
import { Subject } from '../../../../node_modules/rxjs';
import { ContactService } from '../../contact/contact.service';
import { IContactAction } from '../../contact/contact.reducer';
import { ContactActions } from '../../contact/contact.actions';
import * as Cookies from 'js-cookie';
import { PageActions } from '../../main/main.actions';
import { LocationService } from '../../location/location.service';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { PaymentService } from '../../payment/payment.service';
import { IPaymentData, IPayment, IMerchantPaymentData } from '../../payment/payment.model';
import { TransactionService } from '../../transaction/transaction.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit, OnDestroy {
  account: IAccount;
  phone;
  address;
  onDestroy$ = new Subject<any>();
  restaurants: IRestaurant[] = [];
  phoneVerified;
  form;
  errMsg;
  sub;
  bMerchant = false;
  bApplied = false;
  merchantId: string;
  balance = 0;

  receivables = [];
  payments;

  get name() { return this.form.get('name'); }

  constructor(
    private accountSvc: AccountService,
    private rx: NgRedux<IAppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private restaurantSvc: RestaurantService,
    private paymentSvc: PaymentService,
    private transactionSvc: TransactionService,
    private snackBar: MatSnackBar
  ) {
    const self = this;
    this.rx.dispatch({
      type: PageActions.UPDATE_URL,
      payload: 'account-setting'
    });

    this.restaurantSvc.find().pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(rs => {
      self.restaurants = rs;
    });

    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    const self = this;
    this.sub = this.route.queryParams.subscribe(params => {
      this.accountSvc.getCurrentUser().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
        self.account = account;
        const roles = account.roles;
        if (roles && roles.length > 0 && roles.indexOf(Role.MERCHANT_ADMIN) !== -1
          && account.merchants && account.merchants.length > 0
        ) {
          self.bMerchant = true;
          self.reload(account.merchants[0]);
        }

        self.accountSvc.getMerchantApplication(account.id).pipe(
          takeUntil(this.onDestroy$)
        ).subscribe(x => {
          this.bApplied = x !== null;
        });
      });
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  applyMerchant() {
    if (this.form.valid) {
      const v = this.form.value;
      this.accountSvc.applyMerchant(this.account.id, v.name).pipe(
        takeUntil(this.onDestroy$)
      ).subscribe(x => {
        this.snackBar.open('', '已申请成为商户，请等待批准。', { duration: 1000 });
        this.bApplied = true;
      });
    } else {
      // alert('请选择要申请的餐馆');
      this.errMsg = '请输入要申请的餐馆名称';
    }
  }

  onChangeRestaurantName(e) {
    this.errMsg = '';
  }

  // reload(merchantId: string) {
  //   this.transactionSvc.find({where: {type: 'debit', toId: merchantId}}).pipe(takeUntil(this.onDestroy$)).subscribe(ts => {
  //     this.paymentSvc.find({ where: { merchantId: merchantId } }).pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
  //       const payments: IPaymentData[] = [];
  //       let balance = 0;
  //       ps.map(p => {
  //         if (p.type === 'credit') {
  //           balance += p.amount;
  //           payments.push({ date: p.delivered, receivable: p.amount, paid: 0, balance: balance, type: 'credit' });
  //         } else {
  //           balance -= p.amount;
  //           payments.push({ date: p.delivered, receivable: 0, paid: p.amount, balance: balance, type: 'debit' });
  //         }
  //       });
  //       this.balance = balance;
  //     });
  //   });
  // }



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

        let balance = 0;
        payments.map(p => {
          if (p.type === 'credit') {
            balance += p.receivable;
          } else {
            balance -= p.paid;
          }
          p.balance = balance;
        });

        this.balance = balance;
      });
    });
  }

  toPaymentPage() {
    this.router.navigate(['payment/main']);
  }

}
