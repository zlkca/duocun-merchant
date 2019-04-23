import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from '../account.service';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { IAccount } from '../account.model';
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

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit, OnDestroy {
  account: Account;
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

  get name() { return this.form.get('name'); }

  constructor(
    private accountSvc: AccountService,
    private rx: NgRedux<IAppState>,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private restaurantSvc: RestaurantService,
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
      // this.bMerchant = params['merchant'].toLowerCase() === 'true' ? true : false;

      this.accountSvc.getCurrentUser().pipe(
        takeUntil(this.onDestroy$)
      ).subscribe((account: Account) => {
        self.account = account;
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
}
