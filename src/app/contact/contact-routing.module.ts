import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormPageComponent } from './contact-form-page/contact-form-page.component';

const routes: Routes = [{
  path: 'form', component: ContactFormPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
