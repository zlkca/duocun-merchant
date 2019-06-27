import { Product } from '../product/product.model';
import { Picture } from '../picture.model';
import { Address } from '../entity.model';
import { GeoPoint } from '../location/location.model';
import { Order } from '../order/order.model';

export interface IRestaurant {
  id?: string;
  name?: string;
  description?: string;
  location?: GeoPoint;
  ownerId?: string;
  malls?: string[]; // mall id
  inRange?: boolean;
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
}

// For database
export class Restaurant implements IRestaurant {
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
  constructor(data?: IRestaurant) {
    Object.assign(this, data);
  }
}
