import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';

const COOKIE_EXPIRY_DAYS = 365;

@Injectable()
export class AuthService {

  constructor(
  ) {

  }

  setAccessTokenId(token: string) {
    if (token) {
      Cookies.set('duocun-merchant-token-id', token, { expires: COOKIE_EXPIRY_DAYS });
    }
  }

  getAccessTokenId(): string {
    const tokenId = Cookies.get('duocun-merchant-token-id');
    return tokenId ? tokenId : null;
  }

  removeCookies() {
    Cookies.remove('duocun-merchant-token-id');
  }
}
