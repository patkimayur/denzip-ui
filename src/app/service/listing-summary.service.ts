import { EventEmitter, Injectable, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterRequest } from '../models/filter-request';
import { Listing } from '../models/listing';
import { LISTING_SUMMARY_PROPERTIES, SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';
import { CountEntity } from '../models/count-entity';

@Injectable()
export class ListingSummaryService {

  private ACTIVE_LISTING_PATH = 'getActiveListings';
  private ALL_LISTING_PATH = 'getAllListings';
  private ALL_RECENTLY_ADDED_LISTING_PATH = 'getRecentlyAddedListings';
  private ACTIVE_LISTING_COUNT_PATH = 'getActiveListingCount';
  @Output() cartBadgeUpdateEvent = new EventEmitter<any>();
  @Output() cartBadgeUpdateEventForPL = new EventEmitter<any>();


  constructor(private restClientService: RestClientService, private actRoute: ActivatedRoute) { }

  public getActiveListings(filterRequest: FilterRequest) {
    return this.restClientService.executePostCall<Listing[]>(SERVER_BASE_PATH + this.ACTIVE_LISTING_PATH, filterRequest);
  }

  public getAllListings(filterRequest: FilterRequest) {
    return this.restClientService.executePostCall<Listing[]>(SERVER_BASE_PATH + this.ALL_LISTING_PATH, filterRequest);
  }

  public getRecentlyAddedListings() {
    return this.restClientService.executeGetCall<Listing[]>(SERVER_BASE_PATH + this.ALL_RECENTLY_ADDED_LISTING_PATH);
  }

  public getMarathahalliListingCount() {
    return this.restClientService.executeGetCall<number>(SERVER_BASE_PATH + 'getMarathahalliListingCount');
  }

  public getKoramangalaListingCount() {
    return this.restClientService.executeGetCall<number>(SERVER_BASE_PATH + 'getKoramangalaListingCount');
  }

  public getCountEntity() {
    return this.restClientService.executeGetCall<CountEntity>(SERVER_BASE_PATH + 'getPropertyAndUserCount');
  }

  public getBTMListingCount() {
    return this.restClientService.executeGetCall<number>(SERVER_BASE_PATH + 'getBTMListingCount');
  }

  public getActiveListingCount(filterRequest: FilterRequest) {
    return this.restClientService.executePostCall<Number>(SERVER_BASE_PATH + this.ACTIVE_LISTING_COUNT_PATH, filterRequest);
  }

  getSummaryListingInfo(): string {
    return LISTING_SUMMARY_PROPERTIES;
  }

  cartBadgeEvent(listings: Listing[]) {
    if (listings) {
      const listingCount = listings.filter(listing => listing.listingActiveInd).length;
      if (listingCount) {
        this.cartBadgeUpdateEvent.emit(listingCount);
      } else {
        this.cartBadgeUpdateEvent.emit('');
      }
    }
  }

  cartBadgeEventForPL(listings: Listing[]) {
    if (listings) {
      const listingCount = listings.filter(listing => listing.listingActiveInd).length;
      if (listingCount) {
        this.cartBadgeUpdateEventForPL.emit(listingCount);
      } else {
        this.cartBadgeUpdateEventForPL.emit('');
      }
    }
  }
}
