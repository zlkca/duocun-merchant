import { ILocation } from '../location/location.model';
import { IOrderItem } from '../order/order.model';

export interface IAssignment {
  id?: string;
  code?: string;
  distance?: number;
  status?: string;
  created?: Date;
  modified?: Date;
  orderId?: string;
  regionId?: string;
  clientId?: string;
  clientName?: string;
  clientPhoneNumber?: string;
  merchantId?: string;
  merchantName?: string;
  note?: string;
  location?: ILocation;
  delivered?: Date;
  items?: IOrderItem[];
  total?: number;

  mallId?: string;
  mallName?: string;
  driverId?: string;
  driverName?: string;
}


export class Assignment implements IAssignment {
  id?: string;
  code?: string;
  distance?: number;
  status?: string;
  created?: Date;
  modified?: Date;
  orderId?: string;
  regionId?: string;
  clientId?: string;
  clientName?: string;
  clientPhoneNumber?: string;
  merchantId?: string;
  merchantName?: string;
  note?: string;
  location?: ILocation;
  delivered?: Date;

  items?: IOrderItem[];
  total?: number;

  mallId?: string;
  mallName?: string;

  driverId?: string;
  driverName?: string;
}
