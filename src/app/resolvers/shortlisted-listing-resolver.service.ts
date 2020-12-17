import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PageNavigationData } from '../models/page-navigation-data';
import { User } from '../models/user';
import { SECURE_LS } from '../resources/properties';
import { ListingUserRelationService } from '../service/listing-user-relation.service';
import { AbstractResolver } from './abstract-resolver.service';

@Injectable()
export class ShortlistedListingResolver extends AbstractResolver<PageNavigationData> {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private listingUserRelationService: ListingUserRelationService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser == null) {
        super.handleError('User not logged in', this.router);
      }

      return this.listingUserRelationService.getShortlistedListings(currentUser.userId)
        .pipe(
          map(listings => this.pageNavigationData.setListings(listings)),
          // Do not change this to (this.handleError). Router does not gets instantiated in that case
          catchError(err => super.handleError(err, this.router))
        );
    }
  }
}
