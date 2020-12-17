import { Injectable } from '@angular/core';
import { Filter, FilterRequest } from '../models/filter-request';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';

@Injectable()
export class FilterService {

    private static GET_ALL_FILTERS_PATH = 'getFilters';
    private static GET_BEDROOM_COUNT_FILTER_PATH = 'getBedroomCountFilter';
    private static GET_LISTING_TYPE_FILTER_PATH = 'getListingTypeFilter';

    constructor(private restClientService: RestClientService) { }

    public getFilters() {
        return this.restClientService.executeGetCall<FilterRequest>(SERVER_BASE_PATH + FilterService.GET_ALL_FILTERS_PATH);
    }

    public getBedroomCountFilter() {
        return this.restClientService.executeGetCall<Filter>(SERVER_BASE_PATH + FilterService.GET_BEDROOM_COUNT_FILTER_PATH);
    }

    public getListingTypeFilter() {
        return this.restClientService.executeGetCall<Filter>(SERVER_BASE_PATH + FilterService.GET_LISTING_TYPE_FILTER_PATH);
    }
}
