// export interface IMerchantPayment {
//   id?: string;
//   merchantId?: string;
//   merchantName?: string;
//   accountId?: string;
//   accountName?: string;
//   type?: string; // debit credit
//   amount?: number;
//   note?: string;
//   delivered?: Date;
//   status?: string;
//   created?: Date;
//   modified?: Date; // merchant confirm received date
// }

// export interface IMerchantBalance {
//   id?: string;
//   merchantId: string;
//   merchantName: string;
//   amount: number;
//   created?: Date;
//   modified?: Date;
// }
export interface IMerchantPayment {
  id?: string;
  merchantId?: string;
  merchantName?: string;
  accountId?: string;
  accountName?: string;
  type?: string; // debit credit
  amount?: number;
  note?: string;
  delivered?: Date;
  status?: string;
  created?: Date;
  modified?: Date; // merchant confirm received date
}

export interface IMerchantBalance {
  id?: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  created?: Date;
  modified?: Date;
}

export interface IPayment {
  id?: string;
  merchantId?: string;
  merchantName?: string;
  receiverId?: string;
  receiverName?: string;
  credit?: number;
  debit?: number;
  balance?: number;
  note?: string;
  delivered?: Date;
  created?: Date;
  modified?: Date;
}

export interface IBalance {
  id?: string;
  accountId: string;
  accountName: string;
  amount: number;
  created?: Date;
  modified?: Date;
}

export interface IPaymentData {
  date: string;
  receivable: number;
  paid: number;
  balance: number;
  type: string; // credit, debit
}

export interface IMerchantPaymentData {
  date: string;
  received: number;
  paid: number;
  balance: number;
  type: string; // credit, debit
  merchantId?: string;
  merchantName?: string;
  driverId?: string;
  driverName?: string;
}
