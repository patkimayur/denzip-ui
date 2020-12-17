import { Component, OnDestroy, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageNavigationData } from '../../models/page-navigation-data';
import { User } from '../../models/user';
import { AlertService } from '../../service/alert.service';
import { AuthenticationService } from '../../service/authentication.service';
import { INDIA_PHONE_COUNTRY_CODE } from '../../resources/properties';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, OnDestroy, AfterViewChecked {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  mobileBasedReg: string;
  username: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private pageNavigationData: PageNavigationData,
    private cdRef: ChangeDetectorRef) {
    this.user = this.pageNavigationData.userCreateInProgress;
    this.username = this.user.userName;
    this.email = this.user.userEmail;
    if (this.user.userMobile) {
      const delimIndex = this.user.userMobile.indexOf(' ');
      if (delimIndex !== -1) {
        this.countryCode = this.user.userMobile.substring(0, delimIndex);
        this.phoneNumber = this.user.userMobile.substring(delimIndex + 1);
      } else {
        this.countryCode = INDIA_PHONE_COUNTRY_CODE;
        this.phoneNumber = this.user.userMobile;
      }
    }
  }

  ngOnInit() {
    console.log('PageNavigationData: ', JSON.stringify(this.pageNavigationData));
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: [''],
      countryCode: ['', Validators.required],
      internationMobileNumber: ['', Validators.required]
    });
    if (!this.username) {
      this.username = '';
    }
    if (!this.email) {
      this.email = '';
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy() {
    this.pageNavigationData.setUserCreateInProgress(null);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.get('username').invalid || this.loginForm.get('countryCode').invalid || this.loginForm.get('email').invalid) {
      console.log('form invalid');
      return;
    }

    if (this.f.countryCode.value === INDIA_PHONE_COUNTRY_CODE) {
      if (this.loginForm.get('phoneNumber').invalid) {
        return;
      }
      this.user.userMobile = this.f.countryCode.value + ' ' + this.f.phoneNumber.value;
    } else {
      if (this.loginForm.get('internationMobileNumber').invalid) {
        return;
      }
      this.user.userMobile = this.f.countryCode.value + ' ' + this.f.internationMobileNumber.value;

    }

    this.loading = true;
    this.user.userEmail = this.f.email.value;
    this.user.userName = this.f.username.value;
    console.log('User updated from form data: ', JSON.stringify(this.user));
    this.pageNavigationData.setUserCreateInProgress(this.user);
    // Now that user has filled in the details, we first need to verify if user has filled his / her owen phone using otp
    console.log('Trying to generate OTP using phone number and sending via sms: ', this.user.userMobile);
    this.authenticationService.generateOtpByPhoneAndSendSMS(this.user).subscribe(isSuccessful => {
      if (isSuccessful) {
        console.log('OTP generated and sent vis sms, now trying to validate it');
        if (this.f.countryCode.value === INDIA_PHONE_COUNTRY_CODE) {
          this.authenticateOtp(null);
        } else {
          this.authenticateOtp('Login - Internation Phone, OTP Will Sent On Email');
        }
      } else {
        this.alertService.error('Unable to generate otp at this time, please try again later');
      }
    });
  }

  private authenticateOtp(message: string) {
    this.authenticationService.acceptOtpByPhone(this.user, message)
      .subscribe(result => {
        const otp = result;
        if (otp) {
          this.user.otp = otp;
          this.authenticationService.validateOtpByPhone(this.user).subscribe(isValid => {
            if (isValid) {
              // Now if phone is validated, lets create or update user else show error that phone is invalid
              this.authenticationService.createOrUpdateUser(this.user).
                subscribe(userResponse => {
                  if (userResponse && userResponse.userName && userResponse.userMobile) {
                    this.obtainTokenAndRedirect(userResponse, this.returnUrl);
                  } else {
                    console.error('User creation failed');
                    this.loading = false;
                    this.handleError(this.router);
                  }
                },
                  err => {
                    console.error(err);
                    this.loading = false;
                    this.handleError(this.router);
                  },
                  () => {
                    console.log('Request Completed');
                  });
            } else {
              const invalidOtpMessage = 'Invalid OTP provided';
              this.authenticateOtp(invalidOtpMessage);
            }
          });
        } else {
          console.log('No otp provided');
          this.loading = false;
          this.alertService.error('Please validate the phone number with correct OTP to proceed');
        }
      });
  }

  private handleError(router: Router) {
    router.navigate(['/error']);
  }

  private obtainTokenAndRedirect(user: User, redirectUrl: string) {
    if (user && user.userId && user.userMobile) {
      this.authenticationService.obtainAccessToken(user, redirectUrl);
    }
  }
}
