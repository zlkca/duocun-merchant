import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { PackagePageComponent } from './package-page/package-page.component';
import { SettlementPageComponent } from './settlement-page/settlement-page.component';

const routes: Routes = [
  { path: 'history', component: OrderHistoryComponent },
  { path: 'summary', component: SummaryPageComponent },
  { path: 'package', component: PackagePageComponent },
  { path: 'settlement', component: SettlementPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
