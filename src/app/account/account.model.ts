import { IAddress, Address } from '../entity.model';

export enum Role {
  SUPER = 1,
  MERCHANT_ADMIN = 2,
  MERCHANT_STUFF = 3,
  MANAGER = 4,
  STUFF = 5,
  CLIENT = 6,
}

export interface IAccount {
  _id?: string;
  type: string; // wechat, google, fb
  realm?: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  password?: string;
  sex?: string;
  openid?: string; // wechat openid
  imageurl?: string;
  unionid?: string; // wechat unionid
  accessTokens?: any[];
  address?: IAddress;
  roles?: number[];
  merchants?: string[]; // merchant Ids deprecated
  balance?: number;

  merchantAccountId?: string;  // finance account
  info?: string;               // client info input by drivers
}

export class Account implements IAccount {
  type: string;
  realm: string; // wechat, google, fb
  username: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  id: string;
  password: string;
  sex?: string;
  openid?: string; // wechat openid
  imageurl?: string;
  unionid?: string; // wechat unionid
  accessTokens?: any[];
  address?: Address;
  roles?: number[];
  merchants?: string[]; // deprecated
  balance?: number;

  merchantAccountId?: string;  // finance account
  info?: string;               // client info input by drivers
  constructor(data?: IAccount) {
    Object.assign(this, data);
  }
}

