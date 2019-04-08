import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { environment } from '../../environments/environment';
// import { AccountService } from '../account/account.service';
// import { Account } from '../account/account.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogin = false;
  menu: any[];
  user: any;
  keyword: string;
  locality = '';
  type: string;
  addr = null;

  constructor(
    // private router: Router,
    // private accountSvc: AccountService
  ) { }

  ngOnInit() {
    // this.accountSvc.getCurrent().subscribe((account: Account) => {
    //     if (account && account.id) {
    //       this.user = account;
    //       this.type = account.type;
    //       this.isLogin = true;
    //     } else {
    //       this.user = null;
    //       this.isLogin = false;
    //     }
    //   });

    // this.locationSvc.get().subscribe((addr: ILocation) => {
    //     this.locality = addr && (addr.sub_locality || addr.city);
    // });
    // const self = this;
    // const s = localStorage.getItem('location-' + APP);

    // if (s) {
    //   this.addr = JSON.parse(s);
    // }

    // this.sharedSvc.getMsg().subscribe(r => {
    //   if (r.name === 'OnUpdateAddress') {
    //     this.addr = r.addr;
    //   }
    // });
  }

  // getCurrentCity() {
  //   if (this.addr) {
  //     return this.addr.sub_locality ? this.addr.sub_locality : this.addr.city;
  //   } else {
  //     return '';
  //   }
  // }

  // closeNavMenu() {
  //   $('.navbar-collapse').removeClass('show');
  // }

  // toPage(url) {
  //   this.closeNavMenu();
  //   this.router.navigate([url]);
  // }

  // changeAddress() {
  //   this.closeNavMenu();
  //   // this.locationSvc.clear();
  //   this.router.navigate(['home']);
  //   this.addr = null;
  // }

  // changeLanguage(code) {
  //   this.closeNavMenu();
  //   // this.translateServ.use(code);
  // }

  // logout() {
  //   this.closeNavMenu();
  //   this.accountSvc.logout()
  //     .subscribe((sad: any) => {
  //       console.log(sad);
  //       this.user = null;
  //       this.isLogin = false;
  //       this.router.navigate(['home']);
  //     });
  // }

  // toHome() {
  //   // if (this.user) {
  //   // if (this.user.type === 'super') {
  //   //     this.router.navigate(['admin']);
  //   // } else if (this.user.type === 'business') {
  //   //     this.router.navigate(['dashboard']);
  //   // } else {
  //   this.closeNavMenu();
  //   const location = localStorage.getItem('location-' + APP);
  //   if (location) {
  //     this.router.navigate(['home']);
  //   } else {
  //     this.router.navigate(['home']);
  //   }
  //   // }
  //   // }
  // }

  // toBusinessCenter() {
  //   // if login and user is business, redirect to business center, otherwise redirect to business signup
  //   const self = this;
  //   this.closeNavMenu();

  //   // check from token
  //   this.accountSvc.getCurrent().subscribe(
  //     (r: Account) => {
  //       self.isLogin = r && r.id ? true : false;
  //       if (self.isLogin) {
  //         if (r.type === 'business' || r.type === 'super') {
  //           self.router.navigate(['admin']);
  //         } else {
  //           self.accountSvc.logout().subscribe(() => {
  //             self.router.navigate(['institution-signup']);
  //           });
  //         }
  //       } else {
  //         self.router.navigate(['institution-signup']);
  //         // self.router.navigate(['institution-login']);
  //       }
  //     });
  // }
}
