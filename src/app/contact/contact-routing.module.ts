import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactListPageComponent } from './contact-list-page/contact-list-page.component';
import { ContactFormPageComponent } from './contact-form-page/contact-form-page.component';
import { DeliveryDateListPageComponent } from './delivery-date-list-page/delivery-date-list-page.component';

const routes: Routes = [{
  path: 'list', component: ContactListPageComponent
}, {
  path: 'form', component: ContactFormPageComponent
}, {
  path: 'delivery-date', component: DeliveryDateListPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
