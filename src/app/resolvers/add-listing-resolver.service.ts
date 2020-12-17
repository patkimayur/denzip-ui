import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Apartment } from '../models/apartment';
import { Listing } from '../models/listing';
import { PageNavigationData } from '../models/page-navigation-data';
import { User } from '../models/user';
import { SECURE_LS } from '../resources/properties';
import { AddListingService } from '../service/add-listing.service';
import { BrokerOrgService } from '../service/broker-org.service';
import { FilterService } from '../service/filter.service';
import { AbstractResolver } from './abstract-resolver.service';
import { BrokerOrg } from '../models/broker-org';

@Injectable()
export class AddListingResolver extends AbstractResolver<PageNavigationData>  {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private filterService: FilterService, private addListingService: AddListingService,
    private brokerOrgService: BrokerOrgService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {
    console.log('PageNavigationData: ', this.pageNavigationData);
    const listing = new Listing();
    listing.apartment = new Apartment();

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

    const bedroomCountFilter = this.filterService.getBedroomCountFilter();
    const filterRequest = this.filterService.getFilters();
    const listingAmenities = this.addListingService.getDefaultListingAmenities();
    const apartments = this.addListingService.getAllApartments();
    const listingTypeFilter = this.filterService.getListingTypeFilter();

    return forkJoin([bedroomCountFilter, filterRequest, listingAmenities, apartments, listingTypeFilter, brokerOrg]).pipe(
      map(results => {
        listing.listingAmenities = results[2];
        return this.pageNavigationData.setSelectedListing(listing).setBedroomCountFilter(results[0])
          .setFilterRequest(results[1]).setAllApartments(results[3]).setListingTypeFilter(results[4])
          .setBrokerOrg(results[5]);
      }),
      // Do not change this to (this.handleError). Router does not gets instantiated in that case
      catchError(err => super.handleError(err, this.router))
    );
  }
}
