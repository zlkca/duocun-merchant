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
  type: string;
  realm?: string;
  username?: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  id?: string;
  password?: string;
  accessTokens?: any[];
  address?: IAddress;
  roles?: number[];
  merchants?: string[]; // merchant Ids
}

export class Account implements IAccount {
  type: string;
  realm: string;
  username: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  id: string;
  password: string;
  accessTokens: any[];
  address: Address;
  roles?: number[];
  merchants?: string[]; // merchant Ids
  constructor(data?: IAccount) {
    Object.assign(this, data);
  }
}

