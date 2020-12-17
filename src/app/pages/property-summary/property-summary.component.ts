import { Component, AfterViewChecked, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SortDataWrapper } from '../../models/sort-data';
import { AbstractReloadableComponent } from '../../components/reloadable-component/abstract-reloadable-component';
import { Filter, FilterRequest } from '../../models/filter-request';
import { Listing } from '../../models/listing';
import { PageNavigationData } from '../../models/page-navigation-data';
import { ListingSummaryService } from '../../service/listing-summary.service';
import { MetaService } from '../../service/meta.service';
import { SECURE_LS } from '../../resources/properties';
import { UtilsService } from '../../service/utils.service';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { User } from '../../models/user';
import { UserTagDialogComponent } from '../user-display-details/user-display-details.component';
import { MatDialog } from '@angular/material';
import { SignInComponent } from '../sign-in/sign-in.component';
import { LISTING_TYPE_RENTAL } from '../../resources/properties';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-property-summary',
  templateUrl: './property-summary.component.html',
  styleUrls: ['./property-summary.component.css']
})
export class PropertySummaryComponent extends AbstractReloadableComponent {

  listings: Listing[];
  listingSearchInProgress = false;
  selectedSortKey: string;
  sortDataWrapper: SortDataWrapper;
  listingTypeFilter: Filter;
  checkUserTagDialogLoginSuccessful: boolean;

  constructor(protected router: Router,
    private listingSummayService: ListingSummaryService,
    public pageNavigationData: PageNavigationData, private metaService: MetaService,
    private utilsService: UtilsService, private activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef
    , private matSnackbarService: MatSnackbarService,
    public dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) {
    super(router);
    console.log('Inside PropertySummaryComponent constructor');
    this.createSortData();
  }

  private createSortData() {
    const sortDataList = [{ sortKey: 'create_time_dsc', sortValue: 'Order By Posted Time Latest To Oldest' },
    { sortKey: 'create_time_asc', sortValue: 'Order By Posted Time Oldest To Latest' },
    { sortKey: 'rent_value_asc', sortValue: 'Order By Rent / Cost Lowest To Highest' },
    { sortKey: 'rent_value_dsc', sortValue: 'Order By Rent / Cost Highest To Lowest' }
    ];

    this.sortDataWrapper = { sortDataList: sortDataList, lastSelectedSortKey: this.selectedSortKey };
  }

  initialize() {
    console.log('Inside PropertySummaryComponent intialize with cuurentSearchLocation: ', this.pageNavigationData.currentSearchLocation);

    this.listingTypeFilter = this.pageNavigationData.listingTypeFilter;
    this.listings = this.pageNavigationData.listings;

    const listingTypeName = this.utilsService.getListingTypeFromFilter(this.listingTypeFilter);
    const identifier = LISTING_TYPE_RENTAL === listingTypeName ? ' Home, Apartment, Flat For Rent' : ' Home, Apartment, Flat For Sale';
    if (this.pageNavigationData.currentSearchLocation && this.pageNavigationData.currentSearchLocation != null) {
      const commaIndex = this.pageNavigationData.currentSearchLocation.indexOf(',');
      if (commaIndex !== -1) {
        const title = this.pageNavigationData.currentSearchLocation.substring(0, commaIndex) + identifier;
        this.pageNavigationData.listingSummaryPageHeading = title;
        this.metaService.updateTitle(title);
      }
    } else {
      if (isPlatformBrowser(this.platformId)) {
        const placeId = this.activatedRoute.snapshot.queryParams['placeId'];
        this.populatePlaceInformation(placeId);
      }
    }

    if (this.checkUserTagDialogLoginSuccessful) {
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        console.log('trying to open user tag dialog');
        this.openUserTagComponent();
      }
      this.checkUserTagDialogLoginSuccessful = false;
    }
  }

  receiveSelectedSortKey($event) {
    this.selectedSortKey = $event;
    console.log('Recieved selectedSortKey: ', this.selectedSortKey);
    this.sortDataWrapper.lastSelectedSortKey = this.selectedSortKey;
    this.sortListings();
  }

  private sortListings() {
    switch (this.selectedSortKey) {
      case 'create_time_dsc':
        this.listings.sort((firstValue, secondValue) =>
          this.sort(new Date(firstValue.createdTime).getTime(), new Date(secondValue.createdTime).getTime(), false));
        break;
      case 'create_time_asc':
        this.listings.sort((firstValue, secondValue) =>
          this.sort(new Date(firstValue.createdTime).getTime(), new Date(secondValue.createdTime).getTime(), true));
        break;
      case 'rent_value_asc':
        this.listings.sort((firstValue, secondValue) => this.sort(firstValue.listingValue, secondValue.listingValue, true));
        break;
      case 'rent_value_dsc':
        this.listings.sort((firstValue, secondValue) => this.sort(firstValue.listingValue, secondValue.listingValue, false));
        break;
    }
  }

  private sort(firstValue: any, secondValue: any, asc: boolean) {
    console.log('firstValue: %s, secondValue: %s', firstValue, secondValue);
    return asc ? firstValue - secondValue : secondValue - firstValue;
  }

  receiveUpdatedFilters($event) {
    this.listingSearchInProgress = true;
    const updatedFilters = $event;
    console.log('received applied filters: ', updatedFilters);
    // Apart from location filter & user filter, all latest filter will come as event
    // So we only need to extract location filter from existing filter and concat it with others
    // If we do not do this, filters get duplicated and cause issues
    const areaFilter = this.pageNavigationData.filterRequest.filterList.find(filter =>
      'com.crs.denzip.persistence.filters.AreaFilter' === filter.type);
    const userFilter = this.pageNavigationData.filterRequest.filterList.find(filter =>
      'com.crs.denzip.persistence.filters.UserFilter' === filter.type);
    let updatedFilterList: Filter[] = [];
    if (areaFilter) {
      updatedFilterList.push(areaFilter);
    }
    if (userFilter) {
      updatedFilterList.push(userFilter);
    }
    // With now support being for both Sale & Rent, we also need to append listingTypeFilter else
    // both Rent & Sale properties come after any filter is applied
    if (this.listingTypeFilter) {
      updatedFilterList.push(this.listingTypeFilter);
    }
    updatedFilterList = updatedFilterList.concat(updatedFilters);
    this.pageNavigationData.filterRequest.filterList = updatedFilterList;
    console.log('updated filters: ', updatedFilterList);
    this.invokeListingService(updatedFilterList);
  }

  private invokeListingService(filters: Filter[]) {
    const filterRequest: FilterRequest = new FilterRequest();
    filterRequest.filterList = filters;
    this.listingSummayService.getActiveListings(filterRequest).subscribe(
      data => {
        this.listings = data;
        if (this.selectedSortKey && this.selectedSortKey != null) {
          this.sortListings();
        }
      },
      err => this.handleError(this.router),
      () => {
        console.log('Request completed');
        this.listingSearchInProgress = false;
      }
    );
    console.log('Submitting: %s', JSON.stringify(filterRequest));
  }

  private handleError(router: Router) {
    router.navigate(['/error']);
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

  private populatePlaceInformation(placeId: string) {
    new google.maps.Geocoder().geocode({ placeId: placeId }, (results, status) => {
      console.log('GeoResults: ', JSON.stringify(results));
      const geoCoderResult = results[0];
      if (geoCoderResult) {
        const placeResult = {} as google.maps.places.PlaceResult;
        placeResult.formatted_address = geoCoderResult.formatted_address;
        placeResult.geometry = {
          location: geoCoderResult.geometry.location,
          viewport: geoCoderResult.geometry.viewport
        };
        placeResult.place_id = geoCoderResult.place_id;
        this.pageNavigationData.setPlaceResult(placeResult);
        this.pageNavigationData.setCurrentSearchLocation(geoCoderResult.formatted_address);
        const listingTypeName = this.utilsService.getListingTypeFromFilter(this.pageNavigationData.listingTypeFilter);
        const identifier = LISTING_TYPE_RENTAL === listingTypeName ? ' Home, Apartment, Flat For Rent' : ' Home, Apartment, Flat For Sale';
        if (this.pageNavigationData.currentSearchLocation && this.pageNavigationData.currentSearchLocation != null) {
          const commaIndex = this.pageNavigationData.currentSearchLocation.indexOf(',');
          if (commaIndex !== -1) {
            const title = this.pageNavigationData.currentSearchLocation.substring(0, commaIndex) + identifier;
            this.pageNavigationData.listingSummaryPageHeading = title;
            this.metaService.updateTitle(title);
          }
        }
        this.cdRef.detectChanges();
      } else {
        this.handleError(this.router);
      }
    });
  }
}
