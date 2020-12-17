import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { PageNavigationData } from '../models/page-navigation-data';
import { OAuthObj, User } from '../models/user';
import { SECURE_LS, initialiseSecureLS } from '../resources/properties';
import { AuthenticationService } from '../service/authentication.service';
import { MatDialog } from '@angular/material';
import { SignInComponent } from '../pages/sign-in/sign-in.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private pageNavigationData: PageNavigationData,
    private injector: Injector,
    public dialog: MatDialog
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    let access_token = null;
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser && currentUser.oAuthObj) {
        access_token = currentUser.oAuthObj.access_token;
      }
    }
    return next.handle(this.addToken(request, access_token)).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>err).status) {
            case 400:
              return this.handle400Error(err);
            case 401:
              const err$: Observable<any> | Subscription = this.handle401Error(request, next);
              return err$;
            default:
              return throwError(err);
          }
        } else {
          const error = err.error.message || err.statusText;
          return throwError(error);
          // return Observable.throw(error);
        }
      })
    );
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    const authenticationService = this.injector.get(AuthenticationService);
    console.log('inside 401 method before refresh');
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      console.log('inside 401 method');
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        console.log('inside 401 method - has user session intact');
        return authenticationService.obtainRefreshToken().pipe(
          switchMap((oAuthObj) => {
            const newToken: string = this.processRefreshToken(authenticationService, oAuthObj, req, next);
            if (newToken) {
              this.isRefreshingToken = false;
              return next.handle(this.addToken(req, newToken));
            }
            this.login();
            // If we don't get a new token, we are in trouble so logout.
            return authenticationService.logout();
          }),
          catchError(error => {
            // If there is an exception calling 'refreshToken', bad news so logout.
            this.login();
            return authenticationService.logoutWithError(error);
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
      } else {
        this.login();
        return authenticationService.logout();
      }
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token));
        }),
        catchError(error => {
          this.login();
          return authenticationService.logoutWithError(error);
        })
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    const authzHeaderName = 'Authorization';
    if (token && req.headers.get(authzHeaderName) && !req.headers.get(authzHeaderName).startsWith('Basic')) {
      req = req.clone({
        setHeaders: { Authorization: 'Bearer ' + token },
        withCredentials: true
      });
    }
    return req;
  }

  handle400Error(error) {
    if (
      error &&
      error.status === 400 &&
      error.error &&
      error.error.error === 'invalid_grant'
    ) {
      const authenticationService = this.injector.get(AuthenticationService);
      this.login();
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return authenticationService.logoutWithError(error);
    }

    return throwError(error);
  }

  login() {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '400px',
      disableClose: true,
      data: { returnUrl: location.pathname + location.search },
      autoFocus: false
    });
  }

  private processRefreshToken(authenticationService: AuthenticationService, oAuthObj: OAuthObj, req: HttpRequest<any>, next: HttpHandler) {
    authenticationService.saveRefreshToken(oAuthObj);
    const newToken = oAuthObj.access_token;
    if (newToken) {
      this.tokenSubject.next(newToken);
      return newToken;
    }
  }
}
