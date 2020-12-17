/// <reference types="@types/googlemaps" />

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DefaultBedroomCountFilter, Filter, FilterRequest, UserFilter, DefaultListingTypeFilter } from '../models/filter-request';
import { PageNavigationData } from '../models/page-navigation-data';
import { User } from '../models/user';
import { SECURE_LS, DEFAULT_LISTING_TYPE, LISTING_TYPE_RENTAL, initialiseSecureLS } from '../resources/properties';
import { ListingSummaryService } from '../service/listing-summary.service';
import { AbstractResolver } from './abstract-resolver.service';
import { MetaService } from '../service/meta.service';
import { UtilsService } from '../service/utils.service';

@Injectable()
export class ListingSummaryResolver extends AbstractResolver<PageNavigationData> {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private listingSummaryService: ListingSummaryService, private metaService: MetaService,
    private utilsService: UtilsService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {
    console.log('pageNavigationData: ', this.pageNavigationData);
    let filterRequest = this.pageNavigationData.filterRequest;

    if (filterRequest == null || !this.isFilterRequestValid(filterRequest)) {
      filterRequest = new FilterRequest();
      filterRequest.filterList = [];
      const lat = route.queryParams['lat'];
      const lng = route.queryParams['lng'];
      const bhk = route.queryParams['bhk'];
      let listingType = route.queryParams['listingType'];
      const placeId = route.queryParams['placeId'];
      const extendedSearch = route.queryParams['extendedSearch'];
      let proximity = null;
      if (extendedSearch) {
        proximity = 5;
      }
      const areaFilter: Filter = new Filter('com.crs.denzip.persistence.filters.AreaFilter', lat, lng, proximity);
      console.log('areaFilter: ', areaFilter);
      filterRequest.filterList.push(areaFilter);
      if (this.pageNavigationData.bedroomCountFilter == null) {
        const bedroomCountFilter: Filter = new DefaultBedroomCountFilter();
        console.log('BedroomCountFilter: ', JSON.stringify(bedroomCountFilter));
        this.pageNavigationData.setBedroomCountFilter(bedroomCountFilter);
      }
      if (bhk) {
        const bedroomFilter: Filter = this.pageNavigationData.updateBedroomCountFilter(bhk.split(','));
        filterRequest.filterList.push(bedroomFilter);
        this.pageNavigationData.setBedroomCountFilter(bedroomFilter);

      }

      if (this.pageNavigationData.listingTypeFilter == null) {
        const listingTypeFilter: Filter = new DefaultListingTypeFilter();
        console.log('listingTypeFilter: ', JSON.stringify(listingTypeFilter));
        this.pageNavigationData.setListingTypeFilter(listingTypeFilter);
      }

      // if listingType is undefined, we do not want to show both sale & rent properties
      // This will happen only if user is being naughty and trying to modify url manually or it is leagcy url
      // In such cases we will default it to Rent for backward compatibility

      if (!listingType || listingType === null || listingType === '') {
        listingType = DEFAULT_LISTING_TYPE;
      }

      if (listingType) {
        const listingTypeFilter: Filter = this.pageNavigationData.updateListingTypeFilter(listingType);
        filterRequest.filterList.push(listingTypeFilter);
        this.pageNavigationData.setListingTypeFilter(listingTypeFilter);

      }

      this.pageNavigationData.setFilterRequest(filterRequest);
      // TODO - DELETE AFTER TESTING - BEFORE PROD
      /* new google.maps.Geocoder().geocode({ placeId: placeId }, (results, status) => {
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
          const identifier = LISTING_TYPE_RENTAL === listingTypeName ? ' Rental Properties' : ' Sale Properties';
          if (this.pageNavigationData.currentSearchLocation && this.pageNavigationData.currentSearchLocation != null) {
            const commaIndex = this.pageNavigationData.currentSearchLocation.indexOf(',');
            if (commaIndex !== -1) {
              const title = this.pageNavigationData.currentSearchLocation.substring(0, commaIndex) + identifier;
              this.pageNavigationData.listingSummaryPageHeading = title;
              if (!this.metaService.getTitle().includes(title)) {
                this.metaService.updateTitle(title + ' | ' + this.metaService.getTitle());
              }
            }
          }
        } else {
          super.handleError('Error happened during geoCoder invocation', this.router);
        }
      }); */
    }

    initialiseSecureLS();
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser != null) {
        const userFilter: UserFilter = new UserFilter(currentUser.userId);
        filterRequest.filterList.push(userFilter);
      }
    }

    console.log('Submitting: %s', JSON.stringify(filterRequest));
    return this.listingSummaryService.getActiveListings(filterRequest)
      .pipe(
        map(listings => this.pageNavigationData.setListings(listings)),
        // Do not change this to (this.handleError). Router does not gets instantiated in that case
        catchError(err => super.handleError(err, this.router))
      );
  }

  private isFilterRequestValid(filterRequest: FilterRequest): boolean {

    console.log('filterRequest: ', filterRequest);

    if (filterRequest == null) {
      return false;
    }

    if (filterRequest.filterList.length !== 3) {
      return false;
    }

    for (const filter of filterRequest.filterList) {
      if (filter.type !== 'com.crs.denzip.persistence.filters.AreaFilter'
      && filter.type !== 'com.crs.denzip.persistence.filters.BedroomCountFilter'
      && filter.type !== 'com.crs.denzip.persistence.filters.ListingTypeFilter') {
        return false;
      }
    }

    console.log('filterRequest is valid: ', filterRequest);
    return true;
  }
}
