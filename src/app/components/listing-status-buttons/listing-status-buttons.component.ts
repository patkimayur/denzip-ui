import { Component, HostListener, Inject, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Listing } from '../../models/listing';
import { User } from '../../models/user';
import { DaySchedule, DEFAULT_VISIT_SLOTS, UserPrefVisitSlot } from '../../models/user-pref-visit-slot';
import { SignInComponent } from '../../pages/sign-in/sign-in.component';
import { AlertService } from '../../service/alert.service';
import { ListingSummaryService } from '../../service/listing-summary.service';
import { ListingUserRelationService } from '../../service/listing-user-relation.service';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { RazorpayService } from '../../service/razorpay.service';
import { UserService } from '../../service/user.service';
import { UtilsService } from '../../service/utils.service';
import { DeactivateListingDetails } from '../../models/deactivated-listing-details';
import { OWNER_DETAIL_COST, RAZORPAY_KEY_ID, SECURE_LS } from '../../resources/properties';
import { DeactivationDialogComponent } from '../deactivated-listing-component/deactivated-listing-dialog.component';
import { InvalidCashbackDeactivationDialogComponent } from '../deactivated-listing-component/invalid-cashback-dialog.component';
import {
  ScheduleRequestApprovalDialogComponent,
  ScheduleRequestComponent, ScheduleRequestDialogComponent
} from '../schedule-request/schedule-request.component';
import { UserAgreementDialogComponent } from '../user-agreement-dialog/user-agreement-dialog.component';

declare function Razorpay(any): any;

@Component({
  selector: 'app-owner-detail-dialog-component',
  templateUrl: './owner-detail-dialog.component.html',
  styleUrls: ['./listing-status-buttons.component.css']
})
export class OwnerDetailDialogComponent implements OnChanges {

  alertMessage: string;

  constructor(
    private dialogRef: MatDialogRef<OwnerDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('alertMessage: ', this.data);
    this.alertMessage = this.data.alertMessage;
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnChanges() {
    console.log('alertMessage: ', this.data);
    this.alertMessage = this.data.alertMessage;
  }

}

@Component({
  selector: 'app-listing-status-buttons',
  templateUrl: './listing-status-buttons.component.html',
  styleUrls: ['./listing-status-buttons.component.css']
})
export class ListingStatusButtonsComponent implements OnInit {

  userPrefVisitSlot: UserPrefVisitSlot;
  dayScheduleList: DaySchedule[];
  brokerListing: boolean;
  isLoggedInUserAdmin: boolean;
  razorpay: any;
  public ownerDetailCost: number = Number(OWNER_DETAIL_COST) / 100;


  @Input() listing: Listing;
  constructor(private router: Router, private listingSummaryService: ListingSummaryService
    , private listingUserRelationService: ListingUserRelationService, private matSnackbarService: MatSnackbarService,
    public dialog: MatDialog, private userService: UserService, private scheduleRequestComponent: ScheduleRequestComponent,
    private utilsService: UtilsService, private razorpayService: RazorpayService, private alertService: AlertService) { }

  ngOnInit() {
    this.brokerListing = this.listing.createdUserAuthorityNames.findIndex(name => name.includes('ROLE_BROKER')) === -1 ? false : true;
    this.isLoggedInUserAdmin = this.utilsService.isLoggedInUserAdmin();
  }

  addToCart(listing: Listing) {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.addShortlistedListing(listing, currentUser.userId);
      } else {
        console.log('User there in local storage but no userid: ', currentUser);
        const dialogRef = this.dialog.open(SignInComponent, {
          disableClose: true,
          width: '400px',
          data: { returnUrl: location.pathname + location.search },
          autoFocus: false
        });
      }
    } else {
      console.log('No current user found');
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }
  }

  scheduleVisit(listing: Listing) {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.addScheduleVisitListing(listing, currentUser);
      } else {
        const dialogRef = this.dialog.open(SignInComponent, {
          width: '400px',
          disableClose: true,
          data: { returnUrl: location.pathname + location.search },
          autoFocus: false
        });
      }
    } else {
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }
  }

  activateListing(listing: Listing) {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {

        const dialogRefAD = this.dialog.open(UserAgreementDialogComponent, {
          width: '600px',
          height: '600px',
          disableClose: true,
          data: {
            returnUrl: location.pathname + location.search,
            fromDialog: true
          },
          autoFocus: false
        });

        dialogRefAD.afterClosed().subscribe(result => {
          if (result) {
            this.listingUserRelationService.activateListing(listing.listingId).subscribe(
              activatedListingData => {
                if (activatedListingData != null) {
                  this.matSnackbarService.showSnackbar('Listing activated successfully', true);
                  this.router.navigate(['/user-info']);
                } else {
                  this.matSnackbarService.showSnackbar('Failed to activate listing', false);
                }
              },
              err => {
                console.log(err);
              },
              () => {
                console.log('Request Completed');
              }
            );
          }
        });
      }
    }
  }

  deactivateListing(listing: Listing) {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId && listing.listingId) {
        this.listingUserRelationService.listingValidForDeactivation(listing.listingId).subscribe(
          data => {
            if (data) {
              const dialogRefDC = this.dialog.open(DeactivationDialogComponent, {
                width: '400px',
                disableClose: true,
                data: { returnUrl: location.pathname + location.search },
                autoFocus: false
              });

              dialogRefDC.afterClosed().subscribe(result => {
                if (result) {
                  this.listingUserRelationService.deactivateOwnerRelatedListing(new
                    DeactivateListingDetails(currentUser.userId, result, listing.listingId, 'PENDING')
                  ).subscribe(
                    activatedListingData => {
                      if (activatedListingData) {
                        this.matSnackbarService.showSnackbar('Listing deactivated successfully', true);
                        this.router.navigate(['/user-info']);
                      } else {
                        this.matSnackbarService.showSnackbar('Failed to deactivate listing', false);
                      }
                    },
                    err => {
                      console.log(err);
                    },
                    () => {
                      console.log('Request Completed');
                    }
                  );
                }
              });
            } else {
              const dialogRefIC = this.dialog.open(InvalidCashbackDeactivationDialogComponent, {
                width: '400px',
                disableClose: true,
                data: { returnUrl: location.pathname + location.search },
                autoFocus: false
              });

              dialogRefIC.afterClosed().subscribe(result => {
                if (result) {
                  this.listingUserRelationService.deactivateOwnerRelatedListing(
                    new DeactivateListingDetails(currentUser.userId, null, listing.listingId, 'NO_CASHBACK')).subscribe(
                      activatedListingData => {
                        if (activatedListingData) {
                          this.matSnackbarService.showSnackbar('Listing deactivated successfully', true);
                          this.router.navigate(['/user-info']);
                        } else {
                          this.matSnackbarService.showSnackbar('Failed to deactivate listing', false);
                        }
                      },
                      err => {
                        console.log(err);
                      },
                      () => {
                        console.log('Request Completed');
                      }
                    );
                }
              });
            }
          },
          err => console.log(err),
          () => console.log('Request Completed')
        );
      } else {
        const dialogRef = this.dialog.open(SignInComponent, {
          width: '400px',
          disableClose: true,
          data: { returnUrl: location.pathname + location.search },
          autoFocus: false
        });
      }
    } else {
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }
  }


  removeFromCart(listing: Listing) {
    listing.currentLoggedInUserStatus = null;
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.removeShortlistedListing(listing.listingId, currentUser.userId);
      } else {
        const dialogRef = this.dialog.open(SignInComponent, {
          width: '400px',
          disableClose: true,
          data: { returnUrl: location.pathname + location.search },
          autoFocus: false
        });
      }
    } else {
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }
  }

  removeFromProspectiveListings(listing: Listing) {
    listing.currentLoggedInUserStatus = null;
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.removeProspectiveListing(listing.listingId, currentUser.userId);
      } else {
        const dialogRef = this.dialog.open(SignInComponent, {
          width: '400px',
          disableClose: true,
          data: { returnUrl: location.pathname + location.search },
          autoFocus: false
        });
      }
    } else {
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }
  }

  private addShortlistedListing(listing: Listing, currentUserId: string) {
    this.listingUserRelationService.addShortlistedListing(listing.listingId, currentUserId).subscribe(
      data => {
        if (data) {
          this.matSnackbarService.showSnackbar('Listing added to Cart', true);
          listing.currentLoggedInUserStatus = 'SHORTLISTED';
          this.listingUserRelationService.getShortlistedListings(currentUserId)
            .subscribe(
              result => this.listingSummaryService.cartBadgeEvent(result),
              err => console.log(err),
              () => console.log('Request Completed')
            );
          this.listingUserRelationService.getProspectiveListings(currentUserId)
            .subscribe(
              result => this.listingSummaryService.cartBadgeEventForPL(result),
              err => console.log(err),
              () => console.log('Request Completed')
            );
        } else {
          this.matSnackbarService.showSnackbar('Failed to add listing to Cart', false);
        }
      },
      err => console.log(err),
      () => console.log('Request Completed')
    );
  }

  private removeShortlistedListing(listingId: string, currentUserId: string) {
    this.listingUserRelationService.removeShortlistedListing(listingId, currentUserId).subscribe(
      data => {
        if (data) {
          this.matSnackbarService.showSnackbar('Listing removed from Cart', true);
          this.listingUserRelationService.getShortlistedListings(currentUserId)
            .subscribe(
              result => {
                this.listingSummaryService.cartBadgeEvent(result);
                this.router.navigate(['/shortlisted-listings']);
              },
              err => console.log(err),
              () => console.log('Request Completed')
            );
        } else {
          this.matSnackbarService.showSnackbar('Failed to remove listing from Cart', false);
        }
      },
      err => console.log(err),
      () => console.log('Request Completed')
    );
  }

  private removeProspectiveListing(listingId: string, currentUserId: string) {
    this.listingUserRelationService.removeProspectiveListing(listingId, currentUserId).subscribe(
      data => {
        if (data) {
          this.matSnackbarService.showSnackbar('Listing removed from Prospective Listings', true);
          this.listingUserRelationService.getProspectiveListings(currentUserId)
            .subscribe(
              result => {
                this.listingSummaryService.cartBadgeEventForPL(result);
                this.router.navigate(['/user-prospective-info']);
              },
              err => console.log(err),
              () => console.log('Request Completed')
            );
        } else {
          this.matSnackbarService.showSnackbar('Failed to remove listing from Prospective Listings', false);
        }
      },
      err => console.log(err),
      () => console.log('Request Completed')
    );
  }

  private addScheduleVisitListing(listing: Listing, currentUser: User) {
    const currentUserId = currentUser.userId;
    this.userService.getUserPrefVisitSlot(currentUserId).subscribe(
      data => {
        this.userPrefVisitSlot = data;
        console.log('userPrefVisitSlot: ', this.userPrefVisitSlot);

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
          this.openDialog(listing, currentUserId);
        } else {
          this.dayScheduleList = this.userPrefVisitSlot.dayScheduleList;
          console.log('UserPrefVisitSlot is set, dayScheduleList: ', this.dayScheduleList);
          this.invokeSchedulingRequestForListing(listing, currentUser);
        }
      },
      err => console.log(err),
      () => console.log('Request Completed')
    );
  }

  openDialog(listing: Listing, currentUserId: string): void {
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
              data => data ? this.invokeSchedulingRequestForListing(listing, currentUser)
                : console.error('UserPrefVisitSlot update failed'),
              err => console.error(err),
              () => console.log('Request Completed')
            );
        }
      });
    }
  }

  invokeSchedulingRequestForListing(listing: Listing, currentUser: User) {
    const currentUserId = currentUser.userId;
    const dialogRef = this.dialog.open(ScheduleRequestApprovalDialogComponent, {
      width: '350px',
      disableClose: true,
      data: { returnUrl: location.pathname + location.search },
    });

    dialogRef.afterClosed().subscribe(dialogRes => {
      if (dialogRes != null) {
        this.listingUserRelationService.addStatusToListing(listing.listingId, currentUserId, 'SCHEDULING_REQUESTED').subscribe(
          data => {
            if (data) {
              this.matSnackbarService.showSnackbar('Scheduling Visit For Listing', true);
              listing.currentLoggedInUserStatus = 'SCHEDULING_REQUESTED';
              this.listingUserRelationService.getShortlistedListings(currentUserId)
                .subscribe(
                  result => {
                    this.listingSummaryService.cartBadgeEvent(result);
                    this.listingUserRelationService.generateSmsAndMailForScheduling(currentUser).subscribe();
                  },
                  err => console.log(err),
                  () => {
                    console.log('Request Completed');
                    this.scheduleRequestComponent.showAlert(true, false);
                  }
                );
            } else {
              this.matSnackbarService.showSnackbar('Failed to schedule visit for the listing', false);
            }

          },
          err => console.log(err),
          () => console.log('Request Completed')
        );
      }
    });
  }


  getOwnerDetails(listing: Listing) {
    if (SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.razorpayService.getRazorpayOrder(listing.listingId, currentUser.userId, OWNER_DETAIL_COST)
          .subscribe(
            razorpayOrder => {
              if (razorpayOrder && razorpayOrder !== null && razorpayOrder.razorpayOrderId !== null) {
                if (razorpayOrder.orderProcessed) {
                  this.userService.getOwnerDetails(listing.listingId, currentUser.userId)
                    .subscribe(
                      owner => {
                        if (owner && owner != null && owner !== undefined && owner.userMobile !== null) {
                          const message = 'Thank you for choosing Denzip.'
                            + ' The owner details have been retrieved successfuly and the same have been shared over email and sms.'
                            + ' Here are the details for your quick reference - '
                            + 'Owner Name: ' + owner.userName + ', Mobile: ' + owner.userMobile;
                          const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                            width: '400px',
                            data: { alertMessage: message },
                            autoFocus: false
                          });
                        } else {
                          const message = 'Owner Details Cannot Be Retrieved. Please Contact Denzip';
                          const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                            width: '400px',
                            data: { alertMessage: message },
                            autoFocus: false
                          });
                        }
                      },
                      err => console.error(err),
                      () => console.log('Request Completed')
                    );
                } else {
                  this.initializePayment(listing.listingId, currentUser.userId, razorpayOrder.razorpayOrderId);
                  console.log('call to initializePayment done');
                }
              } else {
                this.matSnackbarService
                  .showSnackbar('Sorry we faced a technical issue. Please reach out to our support to get Owner Detials', false);
              }
            },
            err => console.error(err),
            () => console.log('Request Completed')
          );
      } else {
        console.log('User there in local storage but no userid: ', currentUser);
        const dialogRef = this.dialog.open(SignInComponent, {
          disableClose: true,
          width: '400px',
          data: { returnUrl: location.pathname + location.search },
          autoFocus: false
        });
      }
    } else {
      console.log('No current user found');
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }
  }

  getOwnerDetailsDirectly(listing: Listing) {
    if (SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.userService.getOwnerDetails(listing.listingId, currentUser.userId)
                    .subscribe(
                      owner => {
                        if (owner && owner != null && owner !== undefined && owner.userMobile !== null) {
                          const message = 'Thank you for choosing Denzip.'
                            + ' The owner details have been retrieved successfuly and the same have been shared over email and sms.'
                            + ' Here are the details for your quick reference - '
                            + 'Owner Name: ' + owner.userName + ', Mobile: ' + owner.userMobile;
                          const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                            width: '400px',
                            data: { alertMessage: message },
                            autoFocus: false
                          });
                        } else {
                          const message = 'Owner Details Cannot Be Retrieved. Please Contact Denzip';
                          const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                            width: '400px',
                            data: { alertMessage: message },
                            autoFocus: false
                          });
                        }
                      },
                      err => console.error(err),
                      () => console.log('Request Completed')
                    );
      } else {
        console.log('User there in local storage but no userid: ', currentUser);
        const dialogRef = this.dialog.open(SignInComponent, {
          disableClose: true,
          width: '400px',
          data: { returnUrl: location.pathname + location.search },
          autoFocus: false
        });
      }
    } else {
      console.log('No current user found');
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }
  }


  private initializePayment(listingId: string, userId: string, razorpayOrderId: string) {

    if (SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        const options = {
          'key': RAZORPAY_KEY_ID,
          'amount': OWNER_DETAIL_COST,
          'order_id': razorpayOrderId,
          'name': 'Denzip',
          'description': 'Charges For Owner Details',
          'prefill.name': currentUser.userName,
          'prefill.email': currentUser.userEmail,
          'prefill.contact': currentUser.userMobile,
          'handler': ((response) => {
            this.processRazorpayResponse(listingId, userId, razorpayOrderId, response.razorpay_payment_id);
          })

        };

        this.razorpay = Razorpay(options);
        this.razorpay.open();
      }
    } else {
      console.log('No current user found');
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });
    }

  }

  public processRazorpayResponse(listingId: string, userId: string, razorpayOrderId: string, razorpayPaymentId: string) {
    this.razorpayService.updateRazorpayOrderStatus(razorpayOrderId, razorpayPaymentId)
      .subscribe(
        successful => {
          if (successful) {
            this.razorpayService.getRazorpayOrder(listingId, userId, OWNER_DETAIL_COST)
              .subscribe(
                razorpayOrder => {
                  if (razorpayOrder && razorpayOrder !== null && razorpayOrder.razorpayOrderId !== null) {
                    if (razorpayOrder.orderProcessed) {
                      this.userService.getOwnerDetails(listingId, userId)
                        .subscribe(
                          owner => {
                            if (owner && owner != null && owner !== undefined && owner.userMobile !== null) {
                              const message = 'Thank you for choosing Denzip.'
                                + ' The owner details have been retrieved successfuly and the same have been shared over email and sms.'
                                + ' Here are the details for your quick reference - '
                                + 'Owner Name: ' + owner.userName + ', Mobile: ' + owner.userMobile;
                              console.log('Owner Details: ', JSON.stringify(owner));
                              this.matSnackbarService.showSnackbar(message, true);
                              // this.utilsService.showDialog(message);
                              /* const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                                width: '400px',
                                data: { alertMessage: message },
                                autoFocus: false
                              }); */
                            } else {
                              const message = 'Owner Details Cannot Be Retrieved. Please Contact Denzip';
                              const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                                width: '400px',
                                data: { alertMessage: message },
                                autoFocus: false
                              });
                            }
                          },
                          err => console.error(err),
                          () => console.log('Request Completed')
                        );
                    }
                  }
                }
              );
          } else {
            this.matSnackbarService
              .showSnackbar('Sorry we faced a technical issue. Please reach out to our support to get Owner Details', false);
          }
        },
        err => console.error(err),
        () => console.log('Request Completed')
      );
  }

  public reportRentedOut(listing: Listing) {
    if (SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.razorpayService.reportRentedOut(listing.listingId, currentUser.userId)
          .subscribe(
            statusUpdated => {
              if (statusUpdated) {
                const message = 'Thank You for reporting this property. '
                  + 'Our exectuive will get in touch with you in next 24 hours to resolve the concern or process refund';
                const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                  width: '400px',
                  data: { alertMessage: message },
                  autoFocus: false
                });
              } else {
                const message = 'As per our records we notice that you had not retrieved the owner details for this property '
                  + 'or the payment failed during the process. If you feel this is '
                  + 'incorrect, please contact Denzip support at +91 919945120961 or support@denzip.com';
                const dialogRef = this.dialog.open(OwnerDetailDialogComponent, {
                  width: '400px',
                  data: { alertMessage: message },
                  autoFocus: false
                });
              }
            },
            err => console.error(err),
            () => console.log('Request Completed')
          );
      }
    }
  }
}
