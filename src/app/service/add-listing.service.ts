import { Injectable } from '@angular/core';
import { Apartment } from '../models/apartment';
import { Listing } from '../models/listing';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';

@Injectable()
export class AddListingService {

    private static GET_DEFAULT_LISTING_AMENITIES = 'getDefaultListingAmenities';
    private static GET_ALL_APARTMENTS = 'getAllApartments';
    private static ADD_AND_GET_LISTING = 'addAndGetListing';
    private static UPDATE_AND_GET_LISTING = 'updateAndGetListing';

    constructor(private restClientService: RestClientService) { }

    public getDefaultListingAmenities() {
        return this.restClientService.
            executeGetCall<Map<string, boolean>>(SERVER_BASE_PATH + AddListingService.GET_DEFAULT_LISTING_AMENITIES);
    }

    public getAllApartments() {
        return this.restClientService.
            executeGetCall<Apartment[]>(SERVER_BASE_PATH + AddListingService.GET_ALL_APARTMENTS);

    }

    public addListing(listing: Listing) {
        return this.restClientService.executePostCall<Listing>(SERVER_BASE_PATH + AddListingService.ADD_AND_GET_LISTING, listing);

    }

    public updateListing(listing: Listing) {
        return this.restClientService.executePostCall<Listing>(SERVER_BASE_PATH + AddListingService.UPDATE_AND_GET_LISTING, listing);

    }
}
