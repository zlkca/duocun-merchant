import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgRedux } from '@angular-redux/store';
import { MatDialog } from '@angular/material';

import { IAppState } from '../../store';
import { SharedService } from '../../shared/shared.service';
import { Product, IProduct } from '../../product/product.model';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { WarningDialogComponent } from '../../shared/warning-dialog/warning-dialog.component';

const ADD_IMAGE = 'add_photo.png';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit, OnChanges, OnDestroy {

  MEDIA_URL: string = environment.MEDIA_URL;
  defaultProductPicture = window.location.protocol + '//placehold.it/400x300';
  subscription: any;
  cart: any;
  categoryIds;
  groupedOrders: any = {};
  private onDestroy$ = new Subject<void>();

  @Input() categories;
  @Input() groupedProducts: Product[][];
  @Input() mode: string;

  constructor(
    private sharedSvc: SharedService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnChanges(v) {
    const cats = v.categories ? v.categories.currentValue : null;
    const gps = v.groupedProducts ? v.groupedProducts.currentValue : null;
    if (cats) {
      this.categories = cats;
    }
    if (gps) {
      this.groupedProducts = gps;
      const categoryIds = Object.keys(this.groupedProducts);

      categoryIds.map(categoryId => {
        const products = this.groupedProducts[categoryId];
        const orders = [];
        products.map(product => {
          const cartItem = this.cart.items.find(item => item.productId === product.id);
          if (cartItem) {
            orders.push({ productId: product.id, quantity: cartItem.quantity });
          } else {
            orders.push({ productId: product.id, quantity: 0 });
          }
        });

        this.groupedOrders[categoryId] = orders; // product array categoryId;
      });

      if (gps.length > 0) {
        this.categoryIds = Object.keys(this.groupedProducts);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      width: '250px',
      data: {title: '提示', content: '只能选同一餐厅的商品'}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getProductImage(p: Product) {
    if (p.pictures && p.pictures[0] && p.pictures[0].url) {
      return this.sharedSvc.getMediaUrl() + p.pictures[0].url;
    } else {
      return this.defaultProductPicture;
    }
  }
}
