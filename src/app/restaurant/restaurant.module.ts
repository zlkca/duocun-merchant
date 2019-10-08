import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';


// import { ProductModule } from '../product/product.module';
// import { OrderModule } from '../order/order.module';
import { RestaurantService } from './restaurant.service';
// import { LocationService } from '../shared/location/location.service';
// import { ImageUploadModule } from 'angular2-image-upload';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { ProductModule } from '../product/product.module';

import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';
import { OrderService } from '../order/order.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        RestaurantRoutingModule,
        ProductModule,
        // OrderModule,
        // ImageUploadModule.forRoot(),
        ImageUploaderModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      RestaurantService,
      ProductService,
      CategoryService,
      OrderService
    ],
    declarations: [
    ],
    exports: [
    ]
})
export class RestaurantModule { }
