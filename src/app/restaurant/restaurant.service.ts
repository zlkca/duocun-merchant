import { Injectable } from '@angular/core';
// import { RestaurantApi, LoopBackFilter, GeoPoint, Order, OrderApi, Product, Picture, PictureApi } from '../lb-sdk';
import * as moment from 'moment';
import { IMerchant } from './restaurant.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../account/auth.service';
import { EntityService } from '../entity.service';
import { IDeliveryTime } from '../delivery/delivery.model';
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class RestaurantService extends EntityService {

  constructor(
    public authSvc: AuthService,
    public http: HttpClient
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Restaurants';
  }

  getByAccountId(merchantAccountId: string): Observable<any> {
    const url = this.url + '/getByAccountId';
    return this.doGet(url, {id: merchantAccountId});
  }

  isClosed(restaurant: IMerchant, deliveryTime: IDeliveryTime) {
    const deliverDate = moment(deliveryTime.from);
    // const tomorrow = moment().add(1, 'days');
    // const afterTomorrow = moment().add(2, 'days');

    if (restaurant.closed) { // has special close day
      if (restaurant.closed.find(d => moment(d).isSame(deliverDate, 'day'))) {
        return true;
      } else {
        return this.isClosePerWeek(restaurant, deliveryTime);
      }
    } else {
      return this.isClosePerWeek(restaurant, deliveryTime);
    }
  }

  isClosePerWeek(restaurant: IMerchant, deliveryTime: IDeliveryTime) {
    if (restaurant.dow && restaurant.dow.length > 0) {
      const openAll = restaurant.dow.find(d => d === 'all');
      if (openAll) {
        return false;
      } else {
        const r = restaurant.dow.find(d => moment(deliveryTime.from).day() === +d);
        return r ? false : true;
      }
    } else {
      return true;
    }
  }
}
