import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../account.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { IAccount, Role } from '../account.model';
import { Router } from '@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { PageActions } from '../../main/main.actions';
import { RestaurantService } from '../../restaurant/restaurant.service';
import { IRestaurant } from '../../restaurant/restaurant.model';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { TransactionService } from '../../transaction/transaction.service';
import { OrderService } from '../../order/order.service';
import { IOrder } from '../../order/order.model';
import { ITransaction } from '../../transaction/transaction.model';

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
    private router: Router,
    private orderSvc: OrderService,
    private restaurantSvc: RestaurantService,
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
    this.accountSvc.getCurrentUser().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
      self.account = account;
      const roles = account.roles;
      if (roles && roles.length > 0 && roles.indexOf(Role.MERCHANT_ADMIN) !== -1 && account.merchants && account.merchants.length > 0
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

  reload(merchantId: string) {
    this.orderSvc.find({ merchantId: merchantId, status: { $ne: 'del' } }).pipe(takeUntil(this.onDestroy$)).subscribe((os: IOrder[]) => {
      this.transactionSvc.find({ type: 'debit', toId: merchantId }).pipe(takeUntil(this.onDestroy$)).subscribe((ts: ITransaction[]) => {
        let balance = 0;
        os.map(order => {
          let totalCost = 0;
          order.items.map(it => { totalCost += (it.cost * it.quantity); });
          balance += totalCost;
        });

        ts.map(t => {
          balance -= t.amount;
        });
        this.balance = balance;
      });
    });
  }

  toPaymentPage() {
    this.router.navigate(['account/balance']);
  }

}
