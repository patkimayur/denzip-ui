import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { SECURE_LS, initialiseSecureLS } from '../resources/properties';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router,
    public dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (isPlatformBrowser(this.platformId)) {
      initialiseSecureLS();
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
        const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
        const currentUser: User = JSON.parse(securedCurrentUserStr);
        // for now we have ROLE_USER, ROLE_ADMIN & ROLE_BROKER
        if (currentUser
          && currentUser.authorities.findIndex(auth => auth.name.includes('ROLE_ADMIN')) !== -1) {
          // logged in so return true
          return true;
        }
      }

      // not logged in so redirect to login page with the return url
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: '/' + route.url },
        autoFocus: false
      });
      // this.router.navigate(['/sign-in'], { queryParams: { returnUrl: '/' + route.url } });
      return false;
    }
    return false;
  }
}
