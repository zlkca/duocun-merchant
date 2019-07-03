import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { Account, Role } from '../account/account.model';
import { IAppState } from '../store';
import { CommandActions } from '../shared/command.actions';
import { takeUntil } from '../../../node_modules/rxjs/operators';
import { Subject } from '../../../node_modules/rxjs';
import { IMall } from '../mall/mall.model';
import { ILocation } from '../location/location.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  year = 2018;
  account: Account;
  bCart = false;
  bPay = false;
  bContact = false;
  total;
  quantity = 0;
  cart;
  malls: IMall[];
  subtotal = 0;
  deliveryFee = 0;
  tax = 0;
  location: ILocation;
  bHide = false;

  private onDestroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private rx: NgRedux<IAppState>
  ) {
    const self = this;
    this.rx.select('account').pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((account: Account) => {
      self.account = account;
    });

    this.rx.select('location').pipe(
      takeUntil(this.onDestroy$)
    ).subscribe((loc: ILocation) => {
      self.location = loc;
    });

    this.rx.select<string>('page').pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(x => {

    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  toHome() {
    if (this.account) {
      this.router.navigate(['order/summary']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toPack() {
    if (this.account) {
        this.router.navigate(['order/package']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toAccount() {
    const account = this.account;
    const roles = account.roles;
    if (roles && roles.length > 0 && roles.indexOf(Role.MERCHANT_ADMIN) !== -1
      && account.merchants && account.merchants.length > 0
    ) {
      this.router.navigate(['account/setting'], { queryParams: { merchant: true } });
    } else {
      this.router.navigate(['account/setting'], { queryParams: { merchant: false } });
    }
  }

  toSettlement() {
    if (this.account) {
      this.router.navigate(['order/settlement']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toAdmin() {
    if (this.account) {
      this.router.navigate(['admin']);
    } else {
      this.router.navigate(['account/login']);
    }
  }
}
