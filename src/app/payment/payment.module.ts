import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { AccountService } from '../account/account.service';
import { PaymentService } from './payment.service';

@NgModule({
  imports: [
    CommonModule,

    PaymentRoutingModule
  ],
  declarations: [
  ],
  providers: [
    AccountService,
    PaymentService,
    // BalanceService
  ]
})
export class PaymentModule { }
