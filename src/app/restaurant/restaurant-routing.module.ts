import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantDetailPageComponent } from './restaurant-detail-page/restaurant-detail-page.component';

const routes: Routes = [
  { path: 'list/:id', component: RestaurantDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
