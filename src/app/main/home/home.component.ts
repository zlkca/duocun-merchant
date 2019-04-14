import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SharedService } from '../../shared/shared.service';
import { LocationService } from '../../location/location.service';
import { AccountService } from '../../account/account.service';
import { ILocationHistory, IPlace, ILocation, ILatLng, GeoPoint } from '../../location/location.model';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { PageActions } from '../../main/main.actions';
import { SocketService } from '../../shared/socket.service';
import { Router } from '@angular/router';
import { AuthService } from '../../account/auth.service';
import { IPageAction } from '../main.reducers';
import { LocationActions } from '../../location/location.actions';
import { ILocationAction } from '../../location/location.reducer';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { ICommand } from '../../shared/command.reducers';
import { IDeliveryTime } from '../../delivery/delivery.model';
import { IDeliveryTimeAction } from '../../delivery/delivery-time.reducer';
import { DeliveryTimeActions } from '../../delivery/delivery-time.actions';
import { AccountActions } from '../../account/account.actions';
import { Account } from '../../account/account.model';

declare var google;

const APP = environment.APP;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  center: GeoPoint = { lat: 43.761539, lng: -79.411079 };
  restaurants;
  places: IPlace[];
  deliveryAddress = '';
  placeholder = 'Delivery Address';
  mapFullScreen = true;
  subscrAccount;
  account;
  bHideMap = false;
  bTimeOptions = false;
  orderDeadline = {h: 9, m: 30};
  overdue;
  afternoon;
  deliveryTime: IDeliveryTime = { type: '', text: '' };

  inRange = false;
  onDestroy$ = new Subject<any>();

  constructor(
    private accountSvc: AccountService,
    private locationSvc: LocationService,
    private sharedSvc: SharedService,
    private authSvc: AuthService,
    private socketSvc: SocketService,
    private router: Router,
    private rx: NgRedux<IAppState>,
  ) {
  }

  ngOnInit() {
    const self = this;


    // this.accountSvc.getCurrent().pipe(
    //   takeUntil(this.onDestroy$)
    // ).subscribe(account => {
    //   self.account = account;
    //   self.socketSvc.init(this.authSvc.getAccessToken());
    // });
    // this.rx.dispatch<IPageAction>({
    //   type: PageActions.UPDATE_URL,
    //   payload: 'home'
    // });

    this.accountSvc.login('bentoboy', 'duocun').subscribe((data: any) => {
      if (data) {
        self.authSvc.setUserId(data.userId);
        self.authSvc.setAccessToken(data.id);
        self.accountSvc.getCurrentUser().subscribe((account: Account) => {
          if (account) {
            self.rx.dispatch({ type: AccountActions.UPDATE, payload: account }); // update header, footer icons
            self.router.navigate(['order/summary']);
          } else {
            // this.errMsg = 'Wrong username or password';
            // this.router.navigate(['account/login']);
          }
        },
          (error) => {
            // this.errMsg = error.message || 'login failed.';
            console.error('An error occurred', error);
          });
      } else {
        console.log('anonymous try to login ... ');
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
