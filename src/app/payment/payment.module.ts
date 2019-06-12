import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import { AccountService } from '../account/account.service';
import { PaymentService } from './payment.service';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    PaymentRoutingModule
  ],
  declarations: [
    PaymentPageComponent
  ],
  providers: [
    AccountService,
    PaymentService,
    // BalanceService
  ]
})
export class PaymentModule { }
