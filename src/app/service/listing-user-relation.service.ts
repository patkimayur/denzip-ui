import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeactivateListingDetails } from '../models/deactivated-listing-details';
import { Listing } from '../models/listing';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable()
export class ListingUserRelationService {

  private add_shortlisted_listing_path = 'addShortlistedListing';
  private remove_shortlisted_listing_path = 'removeShortlistedListing';
  private remove_prospective_listing_path = 'removeProspectiveListing';
  private get_shortlisted_listings_path = 'getShortlistedListings';
  private get_prospective_listings_path = 'getProspectiveListings';
  private get_user_related_listings_path = 'getUserRelatedListings';
  private get_owner_related_listings_path = 'getOwnerRelatedListings';
  private add_user_listing_mapping_path = 'addUserListingMapping';
  private listing_valid_for_deactivation_path = 'listingValidForDeactivation';
  private deactivate_user_listing_path = 'deactivateOwnerRelatedListing';
  private activate_listing_path = 'activateListing';
  private generate_sms_for_scheduling_path = 'generateSmsAndMailForScheduling';


  constructor(private restClientService: RestClientService) { }

  public addShortlistedListing(listingId: string, currentUserId: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    body = body.set('userId', currentUserId);
    return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.add_shortlisted_listing_path, body);
  }

  public removeShortlistedListing(listingId: string, currentUserId: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    body = body.set('userId', currentUserId);
    return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.remove_shortlisted_listing_path, body);
  }

  public removeProspectiveListing(listingId: string, currentUserId: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    body = body.set('userId', currentUserId);
    return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.remove_prospective_listing_path, body);
  }

  public getShortlistedListings(currentUserId: string) {
    let body = new HttpParams();
    body = body.set('userId', currentUserId);
    return this.restClientService.executePostCall<Listing[]>(SERVER_BASE_PATH + this.get_shortlisted_listings_path, body);
  }

  public getProspectiveListings(currentUserId: string) {
    let body = new HttpParams();
    body = body.set('userId', currentUserId);
    return this.restClientService.executePostCall<Listing[]>(SERVER_BASE_PATH + this.get_prospective_listings_path, body);
  }

  public getUserRelatedListings(currentUserId: string) {
    let body = new HttpParams();
    body = body.set('userId', currentUserId);
    return this.restClientService.executePostCall<Listing[]>(SERVER_BASE_PATH + this.get_user_related_listings_path, body);
  }

  public getOwnerRelatedListings(currentUserId: string) {
    let body = new HttpParams();
    body = body.set('userId', currentUserId);
    return this.restClientService.executePostCall<Listing[]>(SERVER_BASE_PATH + this.get_owner_related_listings_path, body);
  }

  public deactivateOwnerRelatedListing(deactivateListingDetails: DeactivateListingDetails) {
    return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.deactivate_user_listing_path, deactivateListingDetails);
  }

  public activateListing(listingId: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.activate_listing_path, body);
  }

  public generateSmsAndMailForScheduling(user: User) {
    return this.restClientService.executePostCall<User>(
      SERVER_BASE_PATH + this.generate_sms_for_scheduling_path,
      user
    );
  }

  public addStatusToListing(listingId: string, currentUserId: string, scheduleStatus: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    body = body.set('userId', currentUserId);
    body = body.set('scheduleStatus', scheduleStatus);
    return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.add_user_listing_mapping_path, body);
  }



  public listingValidForDeactivation(listingId: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);
    return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.listing_valid_for_deactivation_path, body);
  }

}
