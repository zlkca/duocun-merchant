import { Product, IProduct } from '../product/product.model';
// import { Picture } from '../picture.model';
import { Address, IMerchant } from '../entity.model';
import { Restaurant } from '../restaurant/restaurant.model';

export interface IOrder {
  id?: string;
  code?: string;
  clientId?: string;
  clientName?: string;
  merchantId?: string;
  merchantName?: string;
  merchant?: IMerchant;
  stuffId?: string;
  status?: string;
  clientStatus?: string;
  workerStatus?: string;
  merchantStatus?: string;
  note?: string;
  address?: string;
  delivered?: Date;
  created?: Date;
  modified?: Date;
  items?: IOrderItem[];
  deliveryAddress?: Address;
  deliveryFee?: number;
  deliveryDiscount?: number;
  total?: number;
  price?: number;
  cost?: number;
}

export class Order implements IOrder {
  id: string;
  clientId: string;
  clientName: string;
  merchantId: string;
  merchantName: string;
  stuffId: string;
  status: string;
  clientStatus: string;
  workerStatus: string;
  merchantStatus: string;
  note: string;
  address: string;
  delivered: Date;
  created: Date;
  modified: Date;
  items: OrderItem[];
  deliveryAddress: Address;
  deliveryFee: number;
  deliveryDiscount: number;
  total: number;
  price?: number;
  cost?: number;
  constructor(data?: IOrder) {
    Object.assign(this, data);
  }
}

export interface IOrderItem {
  id?: number;
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  price: number;
  cost: number;
  quantity: number;
  product?: IProduct;
}

export class OrderItem implements IOrderItem {
  id: number;
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  price: number;
  cost: number;
  quantity: number;
  constructor(data?: IOrderItem) {
    Object.assign(this, data);
  }
}
