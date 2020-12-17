import { Injectable } from '@angular/core';
import { Apartment } from '../models/apartment';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';

@Injectable()
export class AddApartmentService {

    private static GET_DEFAULT_APARTMENT_AMENITIES = 'getDefaultApartmentAmenities';
    private static ADD_APARTMENT = 'addApartment';

    constructor(private restClientService: RestClientService) { }

    public getDefaultApartmentAmenities() {
        return this.restClientService.
            executeGetCall<Map<string, boolean>>(SERVER_BASE_PATH + AddApartmentService.GET_DEFAULT_APARTMENT_AMENITIES);
    }

    public addApartment(apartment: Apartment) {
        return this.restClientService.executePostCall<Apartment>(SERVER_BASE_PATH + AddApartmentService.ADD_APARTMENT, apartment);

    }
}
