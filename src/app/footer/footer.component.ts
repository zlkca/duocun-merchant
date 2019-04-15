import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { Account } from '../account/account.model';
import { IAppState } from '../store';
import { CommandActions } from '../shared/command.actions';
import { takeUntil, first } from '../../../node_modules/rxjs/operators';
import { Subject, forkJoin } from '../../../node_modules/rxjs';
import { ICart, ICartItem } from '../cart/cart.model';
import { IMall } from '../mall/mall.model';
import { IAmount } from '../order/order.model';
import { ContactService } from '../contact/contact.service';
import { LocationService } from '../location/location.service';
import { Contact, IContact } from '../contact/contact.model';
import { ILocation } from '../location/location.model';
import { ContactActions } from '../contact/contact.actions';

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
  tips = 3;
  subtotal = 0;
  deliveryFee = 0;
  tax = 0;
  location: ILocation;
  bHide = false;

  private onDestroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private rx: NgRedux<IAppState>,
    private contactSvc: ContactService,
    private locationSvc: LocationService
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
    this.rx.dispatch({
      type: CommandActions.SEND,
      payload: {name: 'clear-address', args: null}
    });
    this.router.navigate(['main/home']);
  }

  toPack() {
    if (this.account) {
        this.router.navigate(['order/package']);
    } else {
      this.router.navigate(['account/login']);
    }
  }

  toCart() {
    if (this.account.type === 'user' || this.account.type === 'super') {
      this.router.navigate(['cart']);
    } else if (this.account.type === 'worker') {
      this.router.navigate(['order/list-worker']);
    } else if (this.account.type === 'restaurant') {
      this.router.navigate(['order/list-restaurant']);
    } else {
      this.router.navigate(['cart']);
    }
  }

  toAccount() {
    this.router.navigate(['account/login']);
  }

  toSettlement() {
    this.router.navigate(['order/settlement']);
  }

  toAdmin() {
    if (this.account) {
      this.router.navigate(['admin']);
    } else {
      this.router.navigate(['account/login']);
    }
  }
}
