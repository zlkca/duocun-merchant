import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { LoginFormComponent } from './login-form/login-form.component';
import { SignupComponent } from './signup/signup.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';
import { AccountPageComponent } from './account-page/account-page.component';
import { MatSelectModule } from '@angular/material/select';
import { RestaurantService } from '../restaurant/restaurant.service';
import { MatSnackBarModule } from '../../../node_modules/@angular/material';
import { TransactionService } from '../transaction/transaction.service';
import { BalancePageComponent } from './balance-page/balance-page.component';
import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { OrderService } from '../order/order.service';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        AccountRoutingModule,
        SharedModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTableModule,
        // MatPaginatorModule,
        MatSortModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
      AccountListComponent,
      AccountFormComponent
    ],
    declarations: [LoginFormComponent, SignupComponent, ChangePasswordComponent,
        ForgetPasswordComponent,
        ProfileFormComponent,
        AccountListComponent,
        AccountFormComponent,
        AccountPageComponent,
        BalancePageComponent
    ],
    providers: [
      AccountService,
      AuthService,
      RestaurantService,
      TransactionService,
      OrderService
    ]
})
export class AccountModule { }
