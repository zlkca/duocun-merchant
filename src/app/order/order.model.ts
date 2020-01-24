import { Product, IProduct } from '../product/product.model';
// import { Picture } from '../picture.model';
import { Address } from '../entity.model';
import { IMerchant } from '../restaurant/restaurant.model';

export enum OrderStatus {
  BAD = 1,
  DELETED = 2,
  TEMP = 3,         // generate a temp order for electronic order
  NEW = 4,
  LOADED,               // The driver took the food from Merchant
  DONE,                 // Finish delivery
  MERCHANT_CHECKED      // VIEWED BY MERCHANT
}

export enum PaymentStatus {
  UNPAID = 1,
  PAID
}

export interface IOrder {
  id?: string;
  code?: string;
  clientId?: string;
  clientName?: string;
  merchantId?: string;
  merchantName?: string;

  status?: OrderStatus;
  paymentStatus?: PaymentStatus;

  note?: string;
  address?: string;

  items?: IOrderItem[];
  deliveryAddress?: Address;
  deliveryFee?: number;
  deliveryDiscount?: number;
  total?: number;
  price?: number;
  cost?: number;

  merchant?: IMerchant;

  delivered?: string;
  created?: string;
  modified?: string;
}

export class Order implements IOrder {
  id: string;
  clientId: string;
  clientName: string;
  merchantId: string;
  merchantName: string;

  status?: OrderStatus;
  paymentStatus?: PaymentStatus;

  note: string;
  address: string;

  items: OrderItem[];
  deliveryAddress: Address;
  deliveryFee: number;
  deliveryDiscount: number;
  total: number;
  price?: number;
  cost?: number;

  delivered?: string;
  created?: string;
  modified?: string;

  constructor(data?: IOrder) {
    Object.assign(this, data);
  }
}

export interface IOrderItem {
  productId: string;    // in db
  price: number;        // in db
  cost: number;         // in db
  quantity: number;     // in db

  productName?: string;
  merchantId?: string;
  merchantName: string;
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
