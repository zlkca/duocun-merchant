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
  mallId?: string;
  created?: Date;
  modified?: Date;
  distance?: number;
  deliveryFee?: number;
  fullDeliveryFee?: number;
  products?: Product[];
  orders?: Order[];
  pictures?: Picture[];
  address?: Address;
}

// For database
export class Restaurant implements IRestaurant {
  name: string;
  description: string;
  location: GeoPoint;
  ownerId: string;
  mallId: string;
  created: Date;
  modified: Date;
  id: string;
  products: Product[];
  pictures: Picture[];
  address: Address;
  constructor(data?: IRestaurant) {
    Object.assign(this, data);
  }
}
