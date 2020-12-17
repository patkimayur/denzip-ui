import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PageNavigationData } from '../models/page-navigation-data';
import { FilterService } from '../service/filter.service';
import { AbstractResolver } from './abstract-resolver.service';
import { ListingSummaryService } from '../service/listing-summary.service';
import {
  FilterRequest, Filter, DefaultBedroomCountFilter,
  DefaultListingTypeFilter, RentListingTypeFilter
} from '../models/filter-request';
import { MARATHAHALLI, BTM, KORAMANGALA } from '../resources/properties';
import { CountEntity } from '../models/count-entity';

@Injectable()
export class HomePageResolver extends AbstractResolver<PageNavigationData> {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private filterService: FilterService, private listingSummaryService: ListingSummaryService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {
    console.log('PageNavigationData: ', this.pageNavigationData);

    const bedroomCountFilter = this.filterService.getBedroomCountFilter();
    const listingTypeFilter = this.filterService.getListingTypeFilter();
    // const recentlyAddedListings = this.listingSummaryService.getRecentlyAddedListings();

    // const marathahalliFilterRequest = this.getAreaListingCountFilterRequest(12.9591722, 77.69741899999997);
    // const marathahalliCount = this.listingSummaryService.getMarathahalliListingCount();

    // const koramangalaFilterRequest = this.getAreaListingCountFilterRequest(12.9352273, 77.62443310000003);
    // const koramangalaCount = this.listingSummaryService.getKoramangalaListingCount();

    // const btmFilterRequest = this.getAreaListingCountFilterRequest(12.9165757, 77.61011630000007);
    // const btmCount = this.listingSummaryService.getBTMListingCount();

    const countEntity: Observable<CountEntity> = this.listingSummaryService.getCountEntity();



    return forkJoin([bedroomCountFilter, listingTypeFilter, countEntity]).pipe(
        map(results => {
          const areaListingCountMap = new Map<string, number>();
          // areaListingCountMap.set(MARATHAHALLI, results[3]);
          // areaListingCountMap.set(KORAMANGALA, results[4]);
          // areaListingCountMap.set(BTM, results[5]);

          return this.pageNavigationData.setBedroomCountFilter(results[0])
            .setListingTypeFilter(results[1])
            .setCountEntity(results[2]);
        }),
        // Do not change this to (this.handleError). Router does not gets instantiated in that case
        catchError(err => super.handleError(err, this.router))
      );
  }

  getAreaListingCountFilterRequest(lat, lng): FilterRequest {
    const filterRequest = new FilterRequest();
    filterRequest.filterList = [];
    const areaFilter: Filter = new Filter('com.crs.denzip.persistence.filters.AreaFilter', lat, lng, 5);
    filterRequest.filterList.push(areaFilter);
    filterRequest.filterList.push(new DefaultBedroomCountFilter());
    filterRequest.filterList.push(new RentListingTypeFilter());

    return filterRequest;
  }
}
