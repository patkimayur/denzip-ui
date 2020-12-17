import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PageNavigationData } from '../models/page-navigation-data';
import { ListingSummaryService } from '../service/listing-summary.service';
import { AbstractResolver } from './abstract-resolver.service';

@Injectable()
export class AllRecentListingsResolver extends AbstractResolver<PageNavigationData> {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private listingSummaryService: ListingSummaryService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {

    if (!this.pageNavigationData.recentlyAddedListings
      || this.pageNavigationData.recentlyAddedListings === null
      || this.pageNavigationData.recentlyAddedListings.length === 0) {

      return this.listingSummaryService.getRecentlyAddedListings()
        .pipe(
          map(listings => this.pageNavigationData.setRecentlyAddedListings(listings)),
          // Do not change this to (this.handleError). Router does not gets instantiated in that case
          catchError(err => super.handleError(err, this.router))
        );
    }
  }
}
