import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactFormPageComponent } from './contact-form-page/contact-form-page.component';
import { ContactListPageComponent } from './contact-list-page/contact-list-page.component';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LocationModule } from '../location/location.module';
import { LocationService } from '../location/location.service';
import { AccountService } from '../account/account.service';
import { DeliveryDateListPageComponent } from './delivery-date-list-page/delivery-date-list-page.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactRoutingModule,
    SharedModule,
    LocationModule
  ],
  declarations: [
    ContactFormPageComponent,
    ContactListPageComponent,
    DeliveryDateListPageComponent
  ],
  providers: [
    LocationService,
    AccountService
  ]
})
export class ContactModule { }
