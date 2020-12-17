import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AbstractReloadableComponent } from '../../components/reloadable-component/abstract-reloadable-component';
import { Listing } from '../../models/listing';
import { PageNavigationData } from '../../models/page-navigation-data';
import { User } from '../../models/user';
import { SECURE_LS } from '../../resources/properties';
import { ListingUserRelationService } from '../../service/listing-user-relation.service';


@Component({
  selector: 'app-user-prospective-info',
  templateUrl: './user-prospective-info.component.html',
  styleUrls: ['./user-prospective-info.component.css']
})
export class UserProspectiveInfoComponent extends AbstractReloadableComponent implements OnInit {

  listings: Listing[];

  constructor(private pageNavigationData: PageNavigationData, protected router: Router,
    private listingUserRelationService: ListingUserRelationService) {
    super(router);
  }

  ngOnInit() {
    this.listings = this.pageNavigationData.listings;
  }

  initialize() {
    this.invokeFetchOwnerListing();
    console.log('Prospective listing reinitialized');
  }

  private invokeFetchOwnerListing() {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser == null) {
        this.handleError('User not logged in', this.router);
      }

      this.listingUserRelationService.getProspectiveListings(currentUser.userId)
        .pipe(
          map(listings => this.pageNavigationData.listings = listings),
          catchError(err => this.handleError(err, this.router))
        );

      this.listings = this.pageNavigationData.listings;
    }
  }

  handleError(err: string, router: Router) {
    console.error('Handling error: "%s" for current url3: %s', err, router.url);
    router.navigate(['/error']);
    return of(err);
  }

}
