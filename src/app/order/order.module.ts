import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '../../../node_modules/@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// import { MatNativeDateModule } from '../../../node_modules/@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { SharedModule } from '../shared/shared.module';
import { OrderService } from './order.service';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderRoutingModule } from './order-routing.module';
import { RestaurantService } from '../restaurant/restaurant.service';
import { AccountService } from '../account/account.service';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { PackagePageComponent } from './package-page/package-page.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderPackComponent } from './order-pack/order-pack.component';
import { SettlementPageComponent } from './settlement-page/settlement-page.component';
import { SettlementComponent } from './settlement/settlement.component';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatMomentDateModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    SharedModule
  ],
  exports: [
  ],
  providers: [
    OrderService,
    RestaurantService,
    AccountService
  ],
  declarations: [
    OrderHistoryComponent,
    OrderSummaryComponent,
    OrderPackComponent,
    SettlementComponent,
    SummaryPageComponent,
    PackagePageComponent,
    SettlementPageComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OrderModule { }
