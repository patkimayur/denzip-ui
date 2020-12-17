import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DaySchedule, DEFAULT_VISIT_SLOTS, UserPrefVisitSlot } from '../../models/user-pref-visit-slot';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user';
import { SignInComponent } from '../../pages/sign-in/sign-in.component';
import { SECURE_LS } from '../../resources/properties';
import { AuthenticationService } from '../../service/authentication.service';
import { ListingSummaryService } from '../../service/listing-summary.service';
import { PropertyDetailService } from '../../service/property-detail.service';
import { AbstractReloadableComponent } from '../reloadable-component/abstract-reloadable-component';
import { ScheduleRequestDialogComponent } from '../schedule-request/schedule-request.component';

@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.css'],
})
export class TopToolbarComponent extends AbstractReloadableComponent implements OnInit {
  title: string;
  isNavbarCollapsed = true;
  cartBadge: number;
  cartBadgeForProspectiveListing: number;
  user = 'Sign In/Sign up';
  isUserNameLess = true;

  /**
   * Constructor
   */
  constructor(private propertyDetailService: PropertyDetailService,
    protected router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private listingSummaryService: ListingSummaryService,
    private userService: UserService,
    public dialog: MatDialog,
    private matSnackbarService: MatSnackbarService) {
    super(router);
  }

  initialize() {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser) {
        // change name to upper case just in case
        currentUser.userName = currentUser.userName.toUpperCase();
        const spaceIndex = currentUser.userName.indexOf(' ');
        if (spaceIndex !== -1) {
          this.user = 'Hello, '.concat(currentUser.userName.substring(0, spaceIndex));
        } else {
          this.user = 'Hello, '.concat(currentUser.userName);
        }
        this.user.length <= 13 ? this.isUserNameLess = true : this.isUserNameLess = false;
      }
    } else {
      if (this.showLogin()) {
        this.user = 'Sign In/Sign up';
      }
    }
    console.log('Top Toolbar reinitialized');
  }

  ngOnInit() {
    this.title = this.propertyDetailService.getTopBarTitle();
    this.listingSummaryService.cartBadgeUpdateEvent.subscribe(cartBadge => {
      this.cartBadge = cartBadge;
    });
    this.listingSummaryService.cartBadgeUpdateEventForPL.subscribe(cartBadge => {
      this.cartBadgeForProspectiveListing = cartBadge;
    });
  }

  navigateToShortlistedListings() {
    this.router.navigate(['/shortlisted-listings']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToContactUs() {
    this.router.navigate(['/contact-us']);
  }

  navigateToAboutUs() {
    this.router.navigate(['/about-us']);
  }



  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }

  navigateToScheduleListings() {
    this.router.navigate(['/schedule-listings']);
  }

  navigateToUserInfoDisplay() {
    this.router.navigate(['/app-user-display-details']);
  }

  navigateToUserInfo() {
    this.router.navigate(['/user-info']);
  }

  navigateToUserProspectiveInfo() {
    this.router.navigate(['/user-prospective-info']);
  }

  navigateToAddListing() {
    this.router.navigate(['/add-listing']);
  }

  navigateToAddBrokerOrg() {
    this.router.navigate(['/app-broker-org-reg']);
  }

  navigateToAddBrokerOrgMapping() {
    this.router.navigate(['/app-broker-org-mapping']);
  }

  navigateToAddApartment() {
    this.router.navigate(['/add-apartment']);
  }

  isUserAdminOrBroker(): boolean {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      // for now we have ROLE_USER, ROLE_ADMIN & ROLE_BROKER
      if (currentUser
        && currentUser.authorities.findIndex(auth => auth.name.includes('ROLE_ADMIN') || auth.name.includes('ROLE_BROKER')) !== -1) {
        // logged in so return true
        return true;
      }
    }
    return false;
  }

  isUserAdmin(): boolean {
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
    return false;
  }

  showLogin(): boolean {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser) {
        return false;
      }
    }
    return true;
  }

  showLogout(): boolean {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser) {
        return true;
      }
    }
    return false;
  }

  cartBadgeUpdateEventHandler($event: number): any {
    if ($event) {
      this.cartBadge = $event;
      console.log('Badge update event is fired');
    }
  }

  cartBadgeForPLUpdateEventHandler($event: number): any {
    if ($event) {
      this.cartBadgeForProspectiveListing = $event;
      console.log('Badge update event is fired');
    }
  }

  login() {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '400px',
      disableClose: true,
      data: { returnUrl: location.pathname + location.search },
      autoFocus: false
    });
  }

  updateVisitPreference() {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);

      this.userService.getUserPrefVisitSlot(currentUser.userId).subscribe(
        data => {
          const userPrefVisitSlot = data;
          console.log('userPrefVisitSlot: ', userPrefVisitSlot);
          if (!userPrefVisitSlot || userPrefVisitSlot == null) {
            console.log('UserPrefVisitSlot is not set, defaulting it');
            const dayScheduleList = [
              new DaySchedule('Saturday', false, DEFAULT_VISIT_SLOTS),
              new DaySchedule('Sunday', false, DEFAULT_VISIT_SLOTS),
              new DaySchedule('Monday', false, DEFAULT_VISIT_SLOTS),
              new DaySchedule('Tuesday', false, DEFAULT_VISIT_SLOTS),
              new DaySchedule('Wednesday', false, DEFAULT_VISIT_SLOTS),
              new DaySchedule('Thursday', false, DEFAULT_VISIT_SLOTS),
              new DaySchedule('Friday', false, DEFAULT_VISIT_SLOTS),
            ];
            this.openDialog(currentUser, dayScheduleList);
          } else {
            const dayScheduleList = userPrefVisitSlot.dayScheduleList;
            console.log('UserPrefVisitSlot is set, dayScheduleList: ', dayScheduleList);
            this.openDialog(currentUser, dayScheduleList);
          }
        },
        err => console.log(err),
        () => console.log('Request Completed')
      );
    }
  }

  openDialog(currentUser: User, dayScheduleList: any): void {
    const dialogRef = this.dialog.open(ScheduleRequestDialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: JSON.parse(JSON.stringify(dayScheduleList)) // deep clone to maintain the original list in case of dialog close
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log('DayScheduleList: %s', JSON.stringify(result));
        const updatedDayScheduleList = result;
        const userPrefVisitSlot = new UserPrefVisitSlot(updatedDayScheduleList);
        this.userService.updateUserPrefVisitSlot(currentUser.userId, userPrefVisitSlot)
          .subscribe(
            data => data ? this.matSnackbarService.showSnackbar('Visit Prefrences Updated Successfully', true)
              : this.matSnackbarService.showSnackbar('Visit Prefrences Update Failed', false),
            err => console.error(err),
            () => console.log('Request Completed')
          );
      }
    });
  }
}
