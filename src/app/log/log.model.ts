import { IAccount } from "../account/account.model";

export enum Action {
  LOGIN = 1,
  VIEW_ORDER,
  PACK_ORDER,
}

export enum AccountType {
  CLIENT = 1,
  MERCHANT,
  DRIVER,
  ADMIN
}

export interface ILog {
  _id?: string;
  accountId: string;
  merchantId?: string;
  merchantAccountId?: string;

  type: AccountType;
  action: Action;

  account?: IAccount;
  created?: string;
}
