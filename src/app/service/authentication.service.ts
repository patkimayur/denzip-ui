import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { PageNavigationData } from '../models/page-navigation-data';
import { OAuthObj, User } from '../models/user';
import { AcceptOTPDialogComponent } from '../pages/sign-in/accept-otp-dialog.component';
import {
  CLIENT_ID, CLIENT_SECRET, OAUTH_ACCESS_TOKEN_URL, SECURE_LS,
  SERVER_BASE_PATH, INDIA_PHONE_COUNTRY_CODE, initialiseSecureLS
} from '../resources/properties';
import { AlertService } from './alert.service';
import { ListingSummaryService } from './listing-summary.service';
import { ListingUserRelationService } from './listing-user-relation.service';
import { RestClientService } from './rest-client.service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';
import { browser, ProtractorBrowser } from 'protractor';
import { IBrowser } from 'selenium-webdriver';


@Injectable()
export class AuthenticationService {
  private static CREATE_OR_UPDATE_USER_PATH = 'createOrUpdateUser';
  private static FIND_BY_PHONE = 'findByPhone';
  private static GENERATE_OTP_PATH = 'generateOtp';
  private static VALIDATE_OTP_PATH = 'validateOtp';
  private static GENERATE_OTP_BY_PHONE_PATH = 'generateOtpByPhone';
  private static VALIDATE_OTP_BY_PHONE_PATH = 'validateOtpByPhone';
  private static FIND_BY_FACEBOOK_ID = 'findByFacebookId';
  private static FIND_BY_GOOLE_ID = 'findByGoogleId';

  private otp: string;


  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
    private restClientService: RestClientService,
    private router: Router,
    private alertService: AlertService,
    public dialog: MatDialog,
    private listingSummaryService: ListingSummaryService,
    private listingUserRelationService: ListingUserRelationService
  ) { }

  createOrUpdateUser(userData: User): Observable<User> {
    return this.restClientService
      .executePostCall<User>(
        SERVER_BASE_PATH + AuthenticationService.CREATE_OR_UPDATE_USER_PATH,
        userData
      );
  }

  logout(): Observable<any> {
    // remove user from local storage to log user out
    this.localStorage.removeItem('currentUser');
    this.listingSummaryService.cartBadgeEvent([]);
    this.listingSummaryService.cartBadgeEventForPL([]);
    return throwError('');
  }


  logoutWithError(error): Observable<any> {
    // remove user from local storage to log user out
    this.localStorage.removeItem('currentUser');
    this.listingSummaryService.cartBadgeEvent([]);
    this.listingSummaryService.cartBadgeEventForPL([]);
    return of(error.message);
  }

  obtainAccessToken(loginData: User, redirectUrl: string) {

    let headers_object = new HttpHeaders();
    headers_object = headers_object.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    headers_object = headers_object.append('Authorization', 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET));

    const httpOptions = {
      headers: headers_object
    };
    let body = new HttpParams();
    body = body.set('username', loginData.userMobile);
    body = body.set('grant_type', 'password');

    this.restClientService.executePostCallWithHeader<OAuthObj>(
      SERVER_BASE_PATH + OAUTH_ACCESS_TOKEN_URL, body,
      httpOptions
    )
      .subscribe(
        oAuthObj => {
          this.saveTokenAndUserInfo(oAuthObj, loginData);
          console.log('url before navigating: ', redirectUrl);
          if (redirectUrl.startsWith('/error')) {
            this.router.navigateByUrl('/home');
          } else {
            this.router.navigateByUrl(redirectUrl);
          }
        });
  }

  obtainRefreshToken(): Observable<any> {
    let body = new HttpParams();
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser && currentUser.oAuthObj) {
        let headers_object = new HttpHeaders();
        headers_object = headers_object.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
        headers_object = headers_object.append('Authorization', 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET));

        const httpOptions = {
          headers: headers_object
        };

        body = body.set('refresh_token', currentUser.oAuthObj.refresh_token);
        body = body.set('grant_type', 'refresh_token');

        return this.restClientService.executePostCallWithHeader<OAuthObj>(
          SERVER_BASE_PATH + OAUTH_ACCESS_TOKEN_URL, body,
          httpOptions
        );
      }
    } else {
      return of(null);
    }
  }

  findByPhone(userData: any): Observable<User> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AuthenticationService.FIND_BY_PHONE,
      userData
    );
  }

  findByFacebookId(userData: any): Observable<User> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AuthenticationService.FIND_BY_FACEBOOK_ID,
      userData
    );
  }

  findByGoogleId(userData: any): Observable<User> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AuthenticationService.FIND_BY_GOOLE_ID,
      userData
    );
  }

  saveTokenAndUserInfo(oAuthObj: OAuthObj, loginData: User) {
    const user = new User();
    user.userId = loginData.userId;
    user.userName = loginData.userName;
    user.userMobile = loginData.userMobile;
    user.userEmail = loginData.userEmail;
    user.oAuthObj = oAuthObj;
    user.authorities = loginData.authorities;
    initialiseSecureLS();
    console.log('the secure ls is:', JSON.stringify(SECURE_LS));
     if (SECURE_LS) {
    // store user details in local storage to keep user logged in between page refreshes
    const encryptedUserInfo = SECURE_LS.AES.encrypt(JSON.stringify(user), 'crsSecureLs');
    SECURE_LS.set('currentUser', encryptedUserInfo.toString());
    // this.saveInCookies('currentUser', user);
    }
    this.listingUserRelationService.getShortlistedListings(loginData.userId)
      .subscribe(
        data => this.listingSummaryService.cartBadgeEvent(data),
        err => console.log(err),
        () => console.log('Request Completed')
      );

    this.listingUserRelationService.getProspectiveListings(loginData.userId)
      .subscribe(
        data => this.listingSummaryService.cartBadgeEventForPL(data),
        err => console.log(err),
        () => console.log('Request Completed')
      );

  }

  saveRefreshToken(oAuthObj: OAuthObj) {
    let userCopy: User;
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      userCopy = JSON.parse(JSON.stringify(currentUser));
      userCopy.oAuthObj = oAuthObj;

      // store user details in local storage to keep user logged in between page refreshes
      SECURE_LS.remove('currentUser');
      // const lsData = { data: [{ user: this.user }] };
      const encryptedUserInfo = SECURE_LS.AES.encrypt(JSON.stringify(userCopy), 'crsSecureLs');
      SECURE_LS.set('currentUser', encryptedUserInfo.toString());

    }
  }

  public generateOTP(phoneNumber: string, returnUrl: string, pageNavigationData: PageNavigationData) {
    const user = new User();
    // if user exists then home page else sign up
    user.userMobile = phoneNumber;
    console.log('Trying to find user by phoneNumber: ', user.userMobile);
    this.findByPhone(user)
      .subscribe(userResponse => {
        console.log('User found by phoneNumber: ', JSON.stringify(userResponse));
        if (userResponse && userResponse.userName) {
          console.log('Validating user by sending OTP via SMS');
          this.generateOtpAndSendSMS(userResponse).subscribe(isSuccessful => {
            console.log('OTP set via SMS, trying to validate the same');
            if (isSuccessful) {
              if (userResponse.userMobile.startsWith(INDIA_PHONE_COUNTRY_CODE)) {
                this.acceptOtp(userResponse, null, returnUrl);
              } else {
                this.acceptOtp(userResponse, 'Login - Internation Phone, OTP Will Sent On Email', returnUrl);
              }
            } else {
              this.alertService.error('Unable to generate otp at this time, please try again later');
            }
          });
        } else {
          pageNavigationData.setUserCreateInProgress(user);
          this.router.navigate(['/app-user-detail'], { queryParams: { returnUrl: returnUrl, mobileReg: 'true' } });
        }
      });
  }

  private generateOtpAndSendSMS(userData: any): Observable<boolean> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AuthenticationService.GENERATE_OTP_PATH,
      userData
    );
  }

  public generateOtpByPhoneAndSendSMS(userData: any): Observable<boolean> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AuthenticationService.GENERATE_OTP_BY_PHONE_PATH,
      userData
    );
  }

  private acceptOtp(user: User, message: string, returnUrl: string): void {
    const dialogRef = this.dialog.open(AcceptOTPDialogComponent, {
      width: '300px',
      disableClose: true,
      data: { otp: this.otp, message: message, user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.otp = result;
      if (this.otp) {
        user.otp = this.otp;
        this.verifyOTP(user, returnUrl);
      }
    });
  }

  private verifyOTP(user: User, returnUrl: string) {
    this.validateOtp(user).subscribe(isValid => {
      if (isValid) {
        this.obtainAccessToken(user, returnUrl);

      } else {
        const message = 'Invalid OTP provided';
        this.acceptOtp(user, message, returnUrl);
      }
    });
  }

  private validateOtp(userData: any): Observable<any> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AuthenticationService.VALIDATE_OTP_PATH,
      userData
    );
  }

  public acceptOtpByPhone(user: User, message: string): Observable<any> {
    const dialogRef = this.dialog.open(AcceptOTPDialogComponent, {
      width: '300px',
      disableClose: true,
      data: { otp: this.otp, message: message, user: user }
    });

    return dialogRef.afterClosed();
  }

  public validateOtpByPhone(userData: any): Observable<any> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AuthenticationService.VALIDATE_OTP_BY_PHONE_PATH,
      userData
    );
  }

}
