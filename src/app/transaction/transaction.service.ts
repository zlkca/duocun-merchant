import { Injectable } from '@angular/core';
import { EntityService } from '../entity.service';
import { AuthService } from '../account/auth.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends EntityService {
  url;

  constructor(
    public authSvc: AuthService,
    public http: HttpClient,
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Transactions';
  }

  getMerchantBalance(merchantAccountId: string, lang: string): Observable<any> {
    const url = this.url + '/getMerchantBalance';
    return this.doGet(url, {id: merchantAccountId, lang: lang});
  }
}
