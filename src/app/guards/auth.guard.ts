import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { SECURE_LS, initialiseSecureLS } from '../resources/properties';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    public dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (isPlatformBrowser(this.platformId)) {
      initialiseSecureLS();
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        // logged in so return true
        return true;
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
