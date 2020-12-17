import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Filter } from '../models/filter-request';
import { Listing } from '../models/listing';
import { User } from '../models/user';
import { LISTING_TYPE_RENTAL, LISTING_TYPE_SALE, SECURE_LS } from '../resources/properties';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  isListingRental(listing: Listing): boolean {
    if (listing) {
      return LISTING_TYPE_RENTAL === listing.listingType;
    }
    return false;
  }

  isListingSale(listing: Listing): boolean {
    if (listing) {
      return LISTING_TYPE_SALE === listing.listingType;
    }
    return false;
  }

  getListingTypeFromFilter(listingTypeFilter: Filter): string {
    if (listingTypeFilter) {
      const listingTypeFilterCondition = listingTypeFilter.conditions.filter(condition => condition.applied);
      if (listingTypeFilterCondition && listingTypeFilterCondition.length > 0) {
        return listingTypeFilterCondition[0].condition;
      }
    }
  }

  isLoggedInUserBroker(): boolean {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      // for now we have ROLE_USER, ROLE_ADMIN & ROLE_BROKER
      if (currentUser && currentUser.authorities.findIndex(auth => auth.name.includes('ROLE_BROKER')) !== -1) {
        return true;
      }
    }
    return false;
  }

  isLoggedInUserAdmin(): boolean {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      // for now we have ROLE_USER, ROLE_ADMIN & ROLE_BROKER
      if (currentUser && currentUser.authorities.findIndex(auth => auth.name.includes('ROLE_ADMIN')) !== -1) {
        return true;
      }
    }
    return false;
  }
}
