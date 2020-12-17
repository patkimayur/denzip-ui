import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FilterRequest, ListingIdFilter, UserFilter } from '../models/filter-request';
import { PageNavigationData } from '../models/page-navigation-data';
import { User } from '../models/user';
import { SECURE_LS, initialiseSecureLS } from '../resources/properties';
import { ListingSummaryService } from '../service/listing-summary.service';
import { PropertyDetailService } from '../service/property-detail.service';
import { AbstractResolver } from './abstract-resolver.service';


@Injectable()
export class PropertyDetailResolver extends AbstractResolver<PageNavigationData> {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private propertyDetailService: PropertyDetailService,
    private listingSummaryService: ListingSummaryService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {
    console.log('pageNavigationData: ', this.pageNavigationData);
    if (this.pageNavigationData.selectedListing != null) {
      return this.propertyDetailService.getLocalityDataFromServer(this.pageNavigationData.selectedListing.listingId)
        .pipe(
          map(localityData => this.pageNavigationData.setLocalityData(localityData)),
          // Do not change this to (this.handleError). Router does not gets instantiated in that case
          catchError(err => super.handleError(err, this.router))
        );
    } else {
      const selectedListingId = route.params['id'];
      console.log('Retriving details for listingId: ', selectedListingId);
      if (selectedListingId != null) {
        // const listingDetail = this.propertyDetailService.getListingDetailFromServer(selectedListingId);
        this.pageNavigationData.filterRequest = new FilterRequest();
        this.pageNavigationData.filterRequest.filterList = [];
        this.pageNavigationData.filterRequest.filterList.push(new ListingIdFilter(selectedListingId));

        initialiseSecureLS();

        if (SECURE_LS && SECURE_LS.get('currentUser')) {
          const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
          const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
          const currentUser: User = JSON.parse(securedCurrentUserStr);
          if (currentUser != null) {
            const userFilter: UserFilter = new UserFilter(currentUser.userId);
            this.pageNavigationData.filterRequest.filterList.push(userFilter);
          }
        }

        const listingDetail = this.listingSummaryService.getAllListings(this.pageNavigationData.filterRequest);
        const localityData = this.propertyDetailService.getLocalityDataFromServer(selectedListingId);

        return forkJoin([listingDetail, localityData]).pipe(
          map(results => {
            return this.pageNavigationData.setSelectedListing(results[0][0]).setLocalityData(results[1]);
          }),
          // Do not change this to (this.handleError). Router does not gets instantiated in that case
          catchError(err => super.handleError(err, this.router))
        );

      } else {
        super.handleError('No listing selected', this.router);
      }
    }
  }
}
