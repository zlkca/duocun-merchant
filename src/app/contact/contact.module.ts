import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactFormPageComponent } from './contact-form-page/contact-form-page.component';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LocationModule } from '../location/location.module';
import { LocationService } from '../location/location.service';
import { AccountService } from '../account/account.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactRoutingModule,
    SharedModule,
    LocationModule
  ],
  declarations: [
    ContactFormPageComponent
  ],
  providers: [
    LocationService,
    AccountService
  ]
})
export class ContactModule { }
