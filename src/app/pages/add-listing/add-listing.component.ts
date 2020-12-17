import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../service/alert.service';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { UserService } from '../../service/user.service';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { Apartment } from '../../models/apartment';
import { Filter } from '../../models/filter-request';
import { CRSImage, Listing } from '../../models/listing';
import { PageNavigationData } from '../../models/page-navigation-data';
import { AddListingService } from '../../service/add-listing.service';
import { ListingUserRelationService } from '../../service/listing-user-relation.service';
import { SECURE_LS, LISTING_TYPE_SALE } from '../../resources/properties';
import { User } from '../../models/user';
import { UtilsService } from '../../service/utils.service';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css']
})
export class AddListingComponent implements OnInit {

  @Input() fileUploadComponent: FileUploadComponent;

  listing: Listing;
  filterList: Filter[];
  bedroomFilter: Filter;
  allApartments: Apartment[];
  createdListingId: string;
  breakpoint: number;
  listingCreationInProgress: boolean;
  existingListing: boolean;
  listingAddressHint: string;
  listingTypeFilter: Filter;
  brokerListing: boolean;
  isOverlayVisible: boolean;

  constructor(@Inject(WINDOW) private window: Window, private pageNavigationData: PageNavigationData,
    private listingUserRelationService: ListingUserRelationService, private addListingService: AddListingService,
    private userService: UserService, private alertService: AlertService,
    private matSnackbarService: MatSnackbarService, private router: Router,
    private utilsService: UtilsService, @Inject(PLATFORM_ID) protected platformId: Object) { }

  ngOnInit() {
    this.listing = this.pageNavigationData.selectedListing;
    this.filterList = this.pageNavigationData.filterRequest.filterList;
    this.bedroomFilter = this.pageNavigationData.bedroomCountFilter;
    this.allApartments = this.pageNavigationData.allApartments;
    this.listingTypeFilter = this.pageNavigationData.listingTypeFilter;

    if (this.listing.listingId != null && this.listing.listingId !== '') {
      this.existingListing = true;
    }

    // Let admins update any listing
    /* if (this.existingListing && this.listing.listingActiveInd) {
      this.alertService.error('Listing is already activated and cannot be edited now');
      this.router.navigate(['/home']);
    } */

    if (this.existingListing && (!this.listing.apartment || this.listing.apartment === null)) {
      this.listing.apartment = new Apartment();
    }

    if (this.listing.listingType == null) {
      this.listing.listingType = 'Rent';
    }

    this.listingAddressHint =
      'Floor (Ground / First etc..), Address, Landmark\n' +
      'Balconies, Main door facing\n' +
      'Flooring, Water Supply (Cauvery / Borewell)\n' +
      'Maintenance (Including / Excluding Rent)\n' +
      'Move In / Move Out Charges\n' +
      'Any other details';

    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      const userId = currentUser.userId;
      if (userId) {
        this.listing.createdByUserId = userId;
      }
      console.log('listing createdByUserId: ', this.listing.createdByUserId);
    }

    if (this.pageNavigationData.brokerOrg && this.pageNavigationData.brokerOrg.brokerOrgId) {
      this.brokerListing = true;
      this.listing.userId = this.pageNavigationData.brokerOrg.brokerOrgMobile;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.breakpoint = (this.window.innerWidth <= 450) ? 2 : 4;
    }

    this.isOverlayVisible = false;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 450) ? 2 : 4;
  }

  getLocation() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.window.navigator && this.window.navigator.geolocation) {
        this.window.navigator.geolocation.getCurrentPosition(
          position => {
            console.log(position);
            this.listing.listingLatitude = position.coords.latitude;
            this.listing.listingLongitude = position.coords.longitude;
          },
          error => {
            switch (error.code) {
              case 1:
                console.log('Permission Denied');
                break;
              case 2:
                console.log('Position Unavailable');
                break;
              case 3:
                console.log('Timeout');
                break;
            }
          }
        );
      }
    }
  }

  markerDragEnd(event: any) {
    console.log('event: ', event);
    this.listing.listingLatitude = event.coords.lat;
    this.listing.listingLongitude = event.coords.lng;
  }

  getAmenitiesName(): string[] {
    const keys: string[] = Object.keys(this.listing.listingAmenities);
    return keys;
  }

  addListing() {
    this.listingCreationInProgress = true;
    this.setDefaultValuesForSaleListings(this.listing);
    this.userService.userExistsByPhone(this.listing.userId).subscribe(
      result => {
        console.log('User with owner mobile exists: ', result);
        if (result) {
          this.isOverlayVisible = true;
          this.addListingService.addListing(this.listing).subscribe(
            data => {
              if (data != null) {
                if (data.listingId != null && data.userId != null) {
                  this.listingUserRelationService.addStatusToListing(data.listingId, data.userId, 'PENDING_ACTIVATION').subscribe(
                    activatedListingData => {
                      if (activatedListingData != null) {
                        this.matSnackbarService.showSnackbar('Listing Added Successfully', true);
                        this.pageNavigationData.selectedListing = data;
                        this.createdListingId = this.pageNavigationData.selectedListing.listingId;
                      } else {
                        this.listingCreationInProgress = false;
                        this.matSnackbarService.showSnackbar('Failed to add Listing', false);
                      }
                    },
                    err => {
                      this.listingCreationInProgress = false;
                      console.log(err);
                    },
                    () => {
                      console.log('Request Completed');
                    }
                  );
                } else {
                  this.listingCreationInProgress = false;
                  this.matSnackbarService.showSnackbar('Failed to add Listing', false);
                }
              } else {
                this.listingCreationInProgress = false;
                this.matSnackbarService.showSnackbar('Failed to add Listing', false);
              }
            }
          );
        } else {
          this.listingCreationInProgress = false;
          this.alertService.error('User with Owner Mobile No. does not exist.'
            + ' Either first assist in user creation or correct the Mobile No.');
        }

      },
      error => {
        console.log(error);
        this.listingCreationInProgress = false;
        this.alertService.error('User with Owner Mobile No. does not exist.'
          + ' Either first assist in user ceration or correct the Mobile No.');
      },
      () => {
        console.log('Request Completed');
      }
    );
  }

  crsImagesUpdateEventHandler($event: CRSImage[]) {
    this.listingCreationInProgress = false;
    let listingImages = $event;
    console.log('updated images: ', listingImages);
    if (listingImages != null) {
      const apartmentImages = this.pageNavigationData.selectedListing.crsImages;
      if (apartmentImages != null && apartmentImages.length > 0) {
        listingImages = listingImages.concat(apartmentImages);
      }
      this.pageNavigationData.selectedListing.crsImages = listingImages;
      console.log('updated pageNavigationData: ', this.pageNavigationData.selectedListing.crsImages);
    }
    this.isOverlayVisible = false;
    this.router.navigate(['/listing-detail/' + this.pageNavigationData.selectedListing.listingId]);
  }

  updateListing() {
    this.listingCreationInProgress = true;
    this.setDefaultValuesForSaleListings(this.listing);
    this.addListingService.updateListing(this.listing).subscribe(
      data => {
        if (data != null) {
          if (data.listingId != null && data.userId != null) {
            this.listingUserRelationService.addStatusToListing(data.listingId, data.userId, 'PENDING_ACTIVATION').subscribe(
              activatedListingData => {
                if (activatedListingData != null) {
                  this.matSnackbarService.showSnackbar('Listing Updated Successfully', true);
                  this.pageNavigationData.selectedListing = data;
                  this.createdListingId = this.pageNavigationData.selectedListing.listingId;
                } else {
                  this.listingCreationInProgress = false;
                  this.matSnackbarService.showSnackbar('Failed to add Listing', false);
                }
              },
              err => {
                this.listingCreationInProgress = false;
                console.log(err);
              },
              () => {
                console.log('Request Completed');
              }
            );
          } else {
            this.listingCreationInProgress = false;
            this.matSnackbarService.showSnackbar('Failed to add Listing', false);
          }
        } else {
          this.listingCreationInProgress = false;
          this.matSnackbarService.showSnackbar('Failed to add Listing', false);
        }
      }
    );
  }

  isListingRental(listing: Listing) {
    return this.utilsService.isListingRental(listing);
  }

  isListingSale(listing: Listing) {
    return this.utilsService.isListingSale(listing);
  }

  private setDefaultValuesForSaleListings(listing: Listing) {
    if (this.isListingSale(listing)) {
      listing.bachelorAllowed = true;
      listing.nonVegAllowed = true;
      listing.transactionMode = 'No Preference';
    }
  }

}
