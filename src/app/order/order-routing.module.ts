import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderFormPageComponent } from './order-form-page/order-form-page.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { PackagePageComponent } from './package-page/package-page.component';

const routes: Routes = [
  { path: 'history', component: OrderHistoryComponent },
  { path: 'form', component: OrderFormPageComponent },
  { path: 'summary', component: SummaryPageComponent },
  { path: 'package', component: PackagePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
