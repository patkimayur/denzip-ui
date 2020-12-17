import { Component, Inject, OnInit, HostListener, Input, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ListingSummaryService } from '../../service/listing-summary.service';
import { ListingUserRelationService } from '../../service/listing-user-relation.service';
import { User } from '../../models/user';
import { DaySchedule, DEFAULT_VISIT_SLOTS, UserPrefVisitSlot } from '../../models/user-pref-visit-slot';
import { SECURE_LS } from '../../resources/properties';
import { UserService } from '../../service/user.service';
import { Listing } from '../../models/listing';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-schedule-request',
  templateUrl: './schedule-request.component.html',
  styleUrls: ['./schedule-request.component.css']
})
export class ScheduleRequestComponent implements OnInit {

  @Input() listings: Listing[];
  DEFAULT_START_TIME = { hour: 8, minute: 0 };
  DEFAULT_END_TIME = { hour: 20, minute: 0 };
  userPrefVisitSlot: UserPrefVisitSlot;
  dayScheduleList: DaySchedule[];

  constructor(@Inject(WINDOW) private window: Window, protected router: Router,
    private dialog: MatDialog, private userService: UserService,
    private listingUserRelationService: ListingUserRelationService,
    private listingSummaryService: ListingSummaryService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      this.userService.getUserPrefVisitSlot(currentUser.userId).subscribe(
        data => console.log(this.userPrefVisitSlot = data),
        err => console.log(err),
        () => console.log('Request Completed')
      );
    }
  }
  }

  scheduleRequest() {
    if (this.listings && this.listings != null && this.listings.length > 0) {

      if (this.userPrefVisitSlot == null) {
        console.log('UserPrefVisitSlot is not set, defaulting it');
        this.dayScheduleList = [
          new DaySchedule('Saturday', false, DEFAULT_VISIT_SLOTS),
          new DaySchedule('Sunday', false, DEFAULT_VISIT_SLOTS),
          new DaySchedule('Monday', false, DEFAULT_VISIT_SLOTS),
          new DaySchedule('Tuesday', false, DEFAULT_VISIT_SLOTS),
          new DaySchedule('Wednesday', false, DEFAULT_VISIT_SLOTS),
          new DaySchedule('Thursday', false, DEFAULT_VISIT_SLOTS),
          new DaySchedule('Friday', false, DEFAULT_VISIT_SLOTS),
        ];

        this.openDialog();
      } else {
        this.dayScheduleList = this.userPrefVisitSlot.dayScheduleList;
        console.log('UserPrefVisitSlot is set, dayScheduleList: ', this.dayScheduleList);
        this.openDialog();
        // this.invokeSchedulingRequest();
      }

    } else {
      this.showAlert(false, true);
    }
  }

  openDialog(): void {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      const dialogRef = this.dialog.open(ScheduleRequestDialogComponent, {
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: JSON.parse(JSON.stringify(this.dayScheduleList)) // deep clone to maintain the original list in case of dialog close
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          console.log('DayScheduleList: %s', JSON.stringify(result));
          this.dayScheduleList = result;
          this.userPrefVisitSlot = new UserPrefVisitSlot(this.dayScheduleList);
          this.userService.updateUserPrefVisitSlot(currentUser.userId, this.userPrefVisitSlot)
            .subscribe(
              data => data ? this.invokeSchedulingRequest() : console.error('UserPrefVisitSlot update failed'),
              err => console.error(err),
              () => console.log('Request Completed')
            );
        }
      });
    }
  }

  private invokeSchedulingRequest() {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);

      const dialogRef = this.dialog.open(ScheduleRequestApprovalDialogComponent, {
        width: '350px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
      });

      dialogRef.afterClosed().subscribe(dialogRes => {
        if (dialogRes != null) {
          this.userService.updateShortlistedListingToScheduleRequest(currentUser.userId)
            .subscribe(
              scheduleRequestResult => {
                if (scheduleRequestResult) {
                  this.listingUserRelationService.getShortlistedListings(currentUser.userId)
                    .subscribe(
                      result => {
                        this.listingSummaryService.cartBadgeEvent(result);
                        this.listingUserRelationService.generateSmsAndMailForScheduling(currentUser).subscribe();
                      },
                      err => console.log(err),
                      () => {
                        console.log('Request Completed');
                        this.showAlert(scheduleRequestResult, true);
                      }
                    );
                }
              },
              scheduleRequestError => console.error(scheduleRequestError),
              () => console.log('Schedule Request Completed')
            );
        }
      });
    }
  }

  showAlert(schedulingSuccess: any, isNavigationRequired: boolean): void {

    const dialogRef = this.dialog.open(ScheduledAlertDialogComponent, {
      width: '350px',
      disableClose: true,
      data: schedulingSuccess
    });

    if (isNavigationRequired) {
      dialogRef.afterClosed().subscribe(result => {
        result ? this.router.navigate(['/schedule-listings']) : this.router.navigate(['/home']);
      });
    }

  }

}

@Component({
  selector: 'app-schedule-request-dialog-component',
  templateUrl: './schedule-request-dialog.component.html',
  styleUrls: ['./schedule-request.component.css'],
  providers: [NgbTimepickerConfig]
})
export class ScheduleRequestDialogComponent implements OnInit {

  dayScheduleList: DaySchedule[];

  constructor(
    public dialogRef: MatDialogRef<ScheduleRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    config: NgbTimepickerConfig, @Inject(PLATFORM_ID) private platformId: Object) {
    config.spinners = false;
    config.size = 'small';
  }

  ngOnInit() {
    console.log('DayScheduleList: ', this.data);
    this.dayScheduleList = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-scheduled-alert-dialog-component',
  templateUrl: './scheduled-alert-dialog.component.html',
  styleUrls: ['./schedule-request.component.css']
})
export class ScheduledAlertDialogComponent implements OnInit {

  schedulingSuccess: boolean;
  alertMessage: string;

  constructor(
    public dialogRef: MatDialogRef<ScheduledAlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log('schedulingSuccess: ', this.data);
    this.schedulingSuccess = this.data;
    if (this.schedulingSuccess) {
      this.alertMessage = 'Thank You for choosing Denzip.' +
        ' We will be working to schedule your visits for selected listings' +
        ' and our representative will get back to you within next 24 hours';
    } else {
      this.alertMessage = 'No listings selected.' +
        ' Please search and shortlist few listings before we can schedule' +
        ' visits to the same.';
    }
  }

}

@Component({
  selector: 'app-schedule-request-approval-dialog-component',
  templateUrl: './schedule-request-approval-dialog.component.html',
  styleUrls: ['./schedule-request.component.css']
})
export class ScheduleRequestApprovalDialogComponent implements OnInit {

  schedulingSuccess: boolean;
  alertMessage: string;

  constructor(
    public dialogRef: MatDialogRef<ScheduleRequestApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  storeResult(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
