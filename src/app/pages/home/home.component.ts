import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { UserService } from '../../service/user.service';
import { OTPDialogComponent } from '../sign-in/accept-otp-dialog.component';
import { SECURE_LS } from '../../resources/properties';
import { User } from '../../models/user';
import { UserTagDialogComponent } from '../user-display-details/user-display-details.component';
import { SignInComponent } from '../sign-in/sign-in.component';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PageNavigationData } from '../../models/page-navigation-data';
import { TagService } from '../../service/tag.service';
import { AbstractReloadableComponent } from '../../components/reloadable-component/abstract-reloadable-component';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends AbstractReloadableComponent implements OnInit {

  displayIcon: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallerScreen: boolean;
  checkUserTagDialogLoginSuccessful: boolean;
  public propertiesServed: Number = 411;
  public customersServed: Number = 829;
  // public uniqueVisitors: Number = 1500;


  constructor(@Inject(WINDOW) private window: Window, private deviceService: DeviceDetectorService,
    public dialog: MatDialog, protected router: Router, public userService: UserService,
    private pageNavigationData: PageNavigationData,
    private tagService: TagService, private matSnackbarService: MatSnackbarService, @Inject(PLATFORM_ID) protected platformId: Object) {
    super(router);
    this.detectDevice();
  }

  initialize() {
    if (this.checkUserTagDialogLoginSuccessful) {
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        console.log('trying to open user tag dialog');
        this.openUserTagComponent();
      }
      this.checkUserTagDialogLoginSuccessful = false;
    }
    console.log('HomeComponent reinitialized');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.displayIcon = (this.window.screen.width >= 470) ? true : false;
      this.isSmallerScreen = (this.window.screen.width <= 340) ? true : false;
    }

    if (this.pageNavigationData && this.pageNavigationData.countEntity && this.pageNavigationData.countEntity.listingCount) {
      console.log('the properties count is', this.pageNavigationData.countEntity.listingCount);
      this.propertiesServed = this.pageNavigationData.countEntity.listingCount;
    }

    if (this.pageNavigationData && this.pageNavigationData.countEntity && this.pageNavigationData.countEntity.userCount) {
      console.log('the user count is', this.pageNavigationData.countEntity.userCount);
      this.customersServed = this.pageNavigationData.countEntity.userCount;
    }
  }

  detectDevice() {
    const deviceInfo = this.deviceService.getDeviceInfo();
    console.log('Device Info: ', deviceInfo);
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();
    console.log(this.isMobile);  // returns if the device is a mobile device
    // (android / iPhone / this.window.log(this.isTablet);  // returns if the device us a tablet (iPad etc)
    console.log(this.isDesktop); // returns if the app is running on a Desktop browser.
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.displayIcon = (this.window.screen.width >= 470) ? true : false;
      this.isSmallerScreen = (this.window.screen.width <= 340) ? true : false;
    }
  }

  requestCallBack() {
    console.log('Invoking Request Callback');
    const dialogRef = this.dialog.open(OTPDialogComponent, {
      width: '300px',
      disableClose: true,
      data: {
        phoneNumber: '',
        returnUrl: '',
        title: 'Request Callback'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const phoneNo = result;
      console.log('result: ', result);
      if (phoneNo) {
        this.userService.addUserRequestCallback(phoneNo).subscribe(
          data => {
            console.log('Request Added: ', data);
            if (data) {
              this.matSnackbarService.showSnackbar('Thank you for choosing Denzip. We will contact you back in next 24 hours', true);
            } else {
              this.matSnackbarService.
                showSnackbar('Error occured while trying to Request Callback. Please use other mechanisms to contact us', false);
            }
          },
          error => {
            console.log(error);
            this.matSnackbarService.
              showSnackbar('Error occured while trying to Request Callback. Please use other mechanisms to contact us.', false);
          },
          () => {
            console.log('Request Completed');
          }
        );
        dialogRef.close();
      }
    });
  }

  handleError(err: string, router: Router) {
    console.error('Handling error: "%s" for current url2: %s', err, router.url);
    router.navigate(['/error']);
    return of(err);
  }

  openPostRequirementDialog() {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      this.openUserTagComponent();
    } else {
      console.log('No current user found');
      console.log('The return url from post requirement is : ', location.pathname + location.search);
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });

      this.checkUserTagDialogLoginSuccessful = true;

    }
  }

  openUserTagComponent() {
    const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
    const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
    const currentUser: User = JSON.parse(securedCurrentUserStr);
    if (currentUser.userId) {
      const dialogRef = this.dialog.open(UserTagDialogComponent, {
        width: '600px',
        disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vh',
      });
    }
  }
}
