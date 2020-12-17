import { HttpParams } from '@angular/common/http';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PageNavigationData } from '../../models/page-navigation-data';
import { User } from '../../models/user';
import { SERVER_BASE_PATH, INDIA_PHONE_COUNTRY_CODE } from '../../resources/properties';
import { AlertService } from '../../service/alert.service';
import { RestClientService } from '../../service/rest-client.service';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-otp-dialog',
  templateUrl: 'otp-dialog.component.html',
})
export class OTPDialogComponent implements OnInit {

  userMobileValidations: FormGroup;
  public title: string;

  constructor(@Inject(WINDOW) private window: Window, 
    public dialogRef: MatDialogRef<OTPDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) { }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }


  ngOnInit() {
    this.userMobileValidations = this.formBuilder.group({
      countryCode: [INDIA_PHONE_COUNTRY_CODE, [Validators.required, Validators.pattern('[0-9]+')]],
      mobileNumber: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      internationMobileNumber: ['', [Validators.required]]
    });
    this.title = this.data.title;
  }

  storeResult(): void {
    console.log('CountryCode: ', this.userMobileValidations.value.countryCode);
    if (this.userMobileValidations.get('countryCode').invalid) {
      return;
    }
    if (INDIA_PHONE_COUNTRY_CODE === this.userMobileValidations.value.countryCode) {
      if (this.userMobileValidations.get('mobileNumber').invalid) {
        return;
      }
      this.dialogRef.close(this.userMobileValidations.value.countryCode + ' ' + this.userMobileValidations.value.mobileNumber);
    } else {
      if (this.userMobileValidations.get('internationMobileNumber').invalid) {
        return;
      }
      this.dialogRef.close(this.userMobileValidations.value.countryCode + ' ' + this.userMobileValidations.value.internationMobileNumber);
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public keyPress(event: any) {
    if (event.charCode !== 0) {
      const pattern = /[0-9]/;

      const inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode !== 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

}

@Component({
  selector: 'app-accept-otp-dialog',
  templateUrl: 'accept-otp-dialog.component.html',
})
export class AcceptOTPDialogComponent implements OnInit {

  private static FIND_BY_PHONE = 'findByPhone';
  private static GENERATE_OTP_PATH = 'generateOtp';
  private static GENERATE_OTP_BY_PHONE_PATH = 'generateOtpByPhone';

  userOtpValidations: FormGroup;
  btnDisable = true;
  user: User;

  constructor(
    public dialogRef: MatDialogRef<AcceptOTPDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private restClientService: RestClientService, private alertService: AlertService,
    private pageNavigationData: PageNavigationData) { }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.data.otp = '';
    this.userOtpValidations = this.formBuilder.group({
      otp: ['', [Validators.required]]
    });
    this.user = this.data.user;

    setTimeout(this.setDisabled(), 20000);
  }

  setDisabled(): any {
    this.btnDisable = false;
  }

  storeResult(): void {
    if (this.userOtpValidations.invalid) {
      return;
    }
    this.dialogRef.close(this.userOtpValidations.value.otp);
  }

  resendOtp(): void {
    if (this.pageNavigationData.userCreateInProgress != null) {
      // As user create is in progress, we should use the generateOtpByPhoneAndSendSMS option
      this.generateOtpByPhoneAndSendSMS(this.pageNavigationData.userCreateInProgress)
        .subscribe(isSuccessful => {
          if (isSuccessful) {
            console.log('OTP generated and sent vis sms, now trying to validate it');
          } else {
            this.alertService.error('Unable to generate otp at this time, please try again later');
          }
        });
    } else {
      // No user create is in progress, we should use the generateOtpAndSendSMS option
      const user = new User();
      user.userMobile = this.user.userMobile;
      console.log('Trying to find user by phoneNumber: ', user.userMobile);
      this.findByPhone(user)
        .subscribe(userResponse => {
          console.log('User found by phoneNumber: ', JSON.stringify(userResponse));
          if (userResponse && userResponse.userName) {
            console.log('Validating user by sending OTP via SMS');
            this.generateOtpAndSendSMS(userResponse).subscribe(isSuccessful => {
              if (isSuccessful) {
                console.log('OTP generated and sent vis sms, now trying to validate it');
              } else {
                this.alertService.error('Unable to generate otp at this time, please try again later');
              }
            });
          }
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private findByPhone(userData: any): Observable<User> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AcceptOTPDialogComponent.FIND_BY_PHONE,
      userData
    );
  }

  private generateOtpAndSendSMS(userData: any): Observable<boolean> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AcceptOTPDialogComponent.GENERATE_OTP_PATH,
      userData
    );
  }

  private generateOtpByPhoneAndSendSMS(userData: any): Observable<boolean> {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + AcceptOTPDialogComponent.GENERATE_OTP_BY_PHONE_PATH,
      userData
    );
  }

}
