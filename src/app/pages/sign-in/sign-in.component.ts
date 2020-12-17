import { Component, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { PageNavigationData } from '../../models/page-navigation-data';
import { User } from '../../models/user';
import { AlertService } from '../../service/alert.service';
import { AuthenticationService } from '../../service/authentication.service';
import { OTPDialogComponent } from './accept-otp-dialog.component';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  private returnUrl: string;
  private phoneNumber: string;
  private otp: string;

  constructor(@Inject(WINDOW) private window: Window, public dialogRef: MatDialogRef<SignInComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socialAuthService: AuthService, private router: Router,
    private authenticationService: AuthenticationService,
    private pageNavigationData: PageNavigationData, private route: ActivatedRoute,
    public dialog: MatDialog,
    private alertService: AlertService) {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  public userMobileSignIn(): void {
    console.log('Return url is ' + this.data.returnUrl);
    const dialogRef = this.dialog.open(OTPDialogComponent, {
      width: '300px',
      disableClose: true,
      data: {
        phoneNumber: this.phoneNumber,
        returnUrl: this.data.returnUrl,
        title: 'Login'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.phoneNumber = result;
      console.log('Phone Number from OTPDialogComponent: ', this.phoneNumber);
      if (this.phoneNumber) {
        this.authenticationService.generateOTP(this.phoneNumber, this.data.returnUrl, this.pageNavigationData);
        this.dialogRef.close();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public facebookSignIn() {
    console.log('Trying to login via facebook');
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID, { scope: 'email' }).then(
      (userData) => {
        const user = new User();
        user.userName = userData.name;
        user.userEmail = userData.email;
        user.userFacebookId = userData.id;

        this.authenticationService.findByFacebookId(user)
          .subscribe(userResponse => {
            // Defaults to 0 if no query param provided.
            this.returnUrl = this.data.returnUrl;
            console.log(' the return url is : ', this.returnUrl);
            if (userResponse && userResponse.userMobile) {
              this.authenticationService.obtainAccessToken(userResponse, this.returnUrl);
            } else {
              // User does not exist by facebookId. We need to either cerate one or update exisitng one with it's facebookId
              this.pageNavigationData.setUserCreateInProgress(user);
              this.router.navigate(['/app-user-detail'], { queryParams: { returnUrl: this.returnUrl } });
            }
          },
            err => {
              console.error(err);
              this.handleError(this.router);
            },
            () => console.log('Request Completed')
          );

        this.dialogRef.close();
      },
      (onError) => {
        console.error('Error happened while trying to login through facebook.' +
          'This either means facebook did not authorize user or user interrupted facebook authorization: ', onError);
        this.alertService.error('Login was either interrupted or failed due to invalid credentials. Plese retry');
      }
    );
  }

  public googleSignIn() {
    console.log('Trying to login via google');
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, { scope: 'email' }).then(
      (userData) => {
        const user = new User();
        user.userName = userData.name;
        user.userEmail = userData.email;
        user.userGoogleId = userData.id;

        this.authenticationService.findByGoogleId(user)
          .subscribe(userResponse => {
            // Defaults to 0 if no query param provided.
            this.returnUrl = this.data.returnUrl;
            console.log(' the return url is : ', this.returnUrl);
            if (userResponse && userResponse.userMobile) {
              this.authenticationService.obtainAccessToken(userResponse, this.returnUrl);
            } else {
              // User does not exist by googleId. We need to either cerate one or update exisitng one with it's googleId
              this.pageNavigationData.setUserCreateInProgress(user);
              this.router.navigate(['/app-user-detail'], { queryParams: { returnUrl: this.returnUrl } });
            }
          },
            err => {
              console.error(err);
              this.handleError(this.router);
            },
            () => console.log('Request Completed')
          );

        this.dialogRef.close();
      },
      (onError) => {
        console.error('Error happened while trying to login through google.' +
          'This either means google did not authorize user or user interrupted google authorization: ', onError);
        this.alertService.error('Login was either interrupted or failed due to invalid credentials. Plese retry');
      }
    );
  }

  private handleError(router: Router) {
    router.navigate(['/error']);
  }

}


