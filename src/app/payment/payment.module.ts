import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { AccountService } from '../account/account.service';

@NgModule({
  imports: [
    CommonModule,

    PaymentRoutingModule
  ],
  declarations: [
  ],
  providers: [
    AccountService,
  ]
})
export class PaymentModule { }
