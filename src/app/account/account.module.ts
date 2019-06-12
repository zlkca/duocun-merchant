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

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        AccountRoutingModule,
        SharedModule,
        MatSelectModule,
        MatSnackBarModule
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
        AccountPageComponent
    ],
    providers: [
      AccountService,
      AuthService,
      RestaurantService,
      TransactionService
    ]
})
export class AccountModule { }
