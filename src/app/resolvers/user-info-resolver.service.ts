import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { PageNavigationData } from '../models/page-navigation-data';
import { User } from '../models/user';
import { SECURE_LS } from '../resources/properties';
import { ListingUserRelationService } from '../service/listing-user-relation.service';
import { AbstractResolver } from './abstract-resolver.service';
import { BrokerOrgService } from '../service/broker-org.service';

@Injectable()
export class UserInfoResolver extends AbstractResolver<PageNavigationData> {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private listingUserRelationService: ListingUserRelationService, private brokerOrgService: BrokerOrgService) {
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

      if (currentUser && currentUser.authorities.findIndex(auth => auth.name.includes('ROLE_BROKER')) !== -1) {

        return this.brokerOrgService.getBrokerOrgByUserId(currentUser.userId)
        .pipe(
          mergeMap(brokerOrg => {
            this.pageNavigationData.setBrokerOrg(brokerOrg);
            return this.listingUserRelationService.getOwnerRelatedListings(brokerOrg.brokerOrgPrimaryUser.userId)
            .pipe(
              map(listings => this.pageNavigationData.setListings(listings)),
              // Do not change this to (this.handleError). Router does not gets instantiated in that case
              catchError(err => super.handleError(err, this.router))
            );
          }),
          // Do not change this to (this.handleError). Router does not gets instantiated in that case
          catchError(err => super.handleError(err, this.router))
        );
      } else {
        return this.listingUserRelationService.getOwnerRelatedListings(currentUser.userId)
          .pipe(
            map(listings => this.pageNavigationData.setListings(listings)),
            // Do not change this to (this.handleError). Router does not gets instantiated in that case
            catchError(err => super.handleError(err, this.router))
          );
      }
    }
  }
}
