import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FilterRequest, ListingIdFilter } from '../models/filter-request';
import { PageNavigationData } from '../models/page-navigation-data';
import { AddListingService } from '../service/add-listing.service';
import { FilterService } from '../service/filter.service';
import { ListingSummaryService } from '../service/listing-summary.service';
import { AbstractResolver } from './abstract-resolver.service';
import { BrokerOrg } from '../models/broker-org';
import { SECURE_LS } from '../resources/properties';
import { BrokerOrgService } from '../service/broker-org.service';
import { User } from '../models/user';

@Injectable()
export class UpdateListingResolver extends AbstractResolver<PageNavigationData>  {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private filterService: FilterService, private addListingService: AddListingService,
    private listingSummaryService: ListingSummaryService, private brokerOrgService: BrokerOrgService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {
    console.log('PageNavigationData: ', this.pageNavigationData);


    const selectedListingId = route.params['id'];
    console.log('Retriving details for listingId: ', selectedListingId);
    if (selectedListingId != null) {
      this.pageNavigationData.filterRequest = new FilterRequest();
      this.pageNavigationData.filterRequest.filterList = [];
      this.pageNavigationData.filterRequest.filterList.push(new ListingIdFilter(selectedListingId));

      let brokerOrg = of(new BrokerOrg());
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
        const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
        const currentUser: User = JSON.parse(securedCurrentUserStr);
        if (currentUser == null) {
          super.handleError('User not logged in', this.router);
        }

        if (currentUser && currentUser.authorities.findIndex(auth => auth.name.includes('ROLE_BROKER')) !== -1) {
          brokerOrg = this.brokerOrgService.getBrokerOrgByUserId(currentUser.userId);
        }
      }


      const listing = this.listingSummaryService.getAllListings(this.pageNavigationData.filterRequest);
      const bedroomCountFilter = this.filterService.getBedroomCountFilter();
      const filterRequest = this.filterService.getFilters();
      const apartments = this.addListingService.getAllApartments();
      const listingTypeFilter = this.filterService.getListingTypeFilter();

      return forkJoin([listing, bedroomCountFilter, filterRequest, apartments, listingTypeFilter, brokerOrg]).pipe(
        map(results => {
          return this.pageNavigationData.setSelectedListing(results[0][0]).setBedroomCountFilter(results[1])
            .setFilterRequest(results[2]).setAllApartments(results[3]).setListingTypeFilter(results[4])
            .setBrokerOrg(results[5]);
        }),
        // Do not change this to (this.handleError). Router does not gets instantiated in that case
        catchError(err => super.handleError(err, this.router))
      );
    }
  }
}
