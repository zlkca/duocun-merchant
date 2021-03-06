import { Product } from '../product/product.model';
import { Picture } from '../picture.model';
import { Address } from '../entity.model';
import { GeoPoint } from '../location/location.model';
import { Order } from '../order/order.model';

export interface IPhase {
  orderEnd: string; // date time string
  pickup: string;   // date time string

  orders?: any[]; // do not save to database
  items?: any[]; // do not save to database
  ordersWithNote?: any[]; // do not save to dababase
}

export interface IRestaurant {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  location?: GeoPoint;
  ownerId?: string;
  malls?: string[]; // mall id
  inRange?: boolean;
  delivered?: Date;
  created?: Date;
  modified?: Date;
  closed?: Date[];
  dow?: string[]; // day of week opening
  isClosed?: boolean;
  distance?: number; // km
  deliveryFee?: number;
  fullDeliveryFee?: number;
  deliveryDiscount?: number;
  products?: Product[];
  orders?: Order[];
  pictures?: Picture[];
  address?: Address;
  order?: number;
  pickupTime?: string;

  phases?: IPhase[];
}

// For database
export class Restaurant implements IRestaurant {
  _id: string;
  id: string;
  name: string;
  description: string;
  location: GeoPoint;
  ownerId: string;
  malls: string[]; // mall id
  created: Date;
  modified: Date;
  closed?: Date[];
  dow?: string[]; // day of week opening
  products: Product[];
  pictures: Picture[];
  address: Address;
  order?: number;
  pickupTime?: string;

  phases?: IPhase[];
  constructor(data?: IRestaurant) {
    Object.assign(this, data);
  }
}
