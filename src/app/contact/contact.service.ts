import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../account/auth.service';
import { EntityService } from '../entity.service';
import { Contact, IContact } from './contact.model';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends EntityService {

  url;

  constructor(
    public http: HttpClient,
    public authSvc: AuthService
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Contacts';
  }

  save(d: Contact): Observable<any> {
    return this.http.post(this.url, d);
  }

  replace(d: Contact): Observable<any> {
    return this.http.put(this.url, d);
  }

  sendVerifyMessage(d: IContact): Observable<any> {
    const url = super.getBaseUrl() + 'sendVerifyMsg';
    return this.http.post(url, d);
  }

  verifyCode(code: string, accountId: string): Observable<any> {
    const url = super.getBaseUrl() + 'smsverify';
    return this.http.post(url, {code: code, accountId: accountId});
  }
}
