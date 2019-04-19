export interface IEntity {
  id ?: string;
}

export interface IMerchant {
  id?: string;
  name?: string;
}

export interface IAddress {
  formattedAddress: string;
  unit?: number;
  streetName: string;
  streetNumber: string;
  sublocality?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  created?: Date;
  modified?: Date;
  id?: number;
}

export class Address implements IAddress {
  formattedAddress: string;
  unit: number;
  streetName: string;
  streetNumber: string;
  sublocality: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  created: Date;
  modified: Date;
  id: number;
  constructor(data?: IAddress) {
    Object.assign(this, data);
  }
}
