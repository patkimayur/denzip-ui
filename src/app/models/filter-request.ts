import { Injectable } from '@angular/core';

export class FilterCondition {
    condition: string;
    applied: boolean;
}

export class Filter {
    title: string;
    type: string;
    filterType: string;
    conditions: FilterCondition[];
    range: number[];
    latitude: number;
    longitude: number;
    proximity: number;
    userId: string;
    values: string[];

    constructor(type, latitude, longitude, proximity) {
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.proximity = proximity;
    }

}

export class UserFilter extends Filter {
    userId: string;

    constructor(userId: string) {
        super('com.crs.denzip.persistence.filters.UserFilter', null, null, null);
        this.userId = userId;
    }
}

export class ListingIdFilter extends Filter {
    userId: string;

    constructor(listingId: string) {
        super('com.crs.denzip.persistence.filters.ListingIdFilter', null, null, null);
        this.values = [listingId];
    }
}

export class OwnerIdFilter extends Filter {
  userId: string;

  constructor(listingId: string) {
      super('com.crs.denzip.persistence.filters.OwnerIdFilter', null, null, null);
      this.values = [listingId];
  }
}

export class DefaultBedroomCountFilter extends Filter {

    constructor() {
        super('com.crs.denzip.persistence.filters.BedroomCountFilter', null, null, null);
        this.filterType = 'ValueFilter';
        this.title = 'No. of Bedrooms';
        this.conditions = [];
        this.conditions.push({condition: '1 RK', applied: false});
        this.conditions.push({condition: '1 BHK', applied: false});
        this.conditions.push({condition: '2 BHK', applied: false});
        this.conditions.push({condition: '3 BHK', applied: false});
        this.conditions.push({condition: '4+ BHK', applied: false});
    }
}

export class DefaultListingTypeFilter extends Filter {

    constructor() {
        super('com.crs.denzip.persistence.filters.ListingTypeFilter', null, null, null);
        this.filterType = 'ValueFilter';
        this.title = 'Rent / Buy';
        this.conditions = [];
        this.conditions.push({condition: 'Rent', applied: false});
        this.conditions.push({condition: 'Sale', applied: false});
    }
}

export class RentListingTypeFilter extends Filter {

    constructor() {
        super('com.crs.denzip.persistence.filters.ListingTypeFilter', null, null, null);
        this.filterType = 'ValueFilter';
        this.title = 'Rent / Buy';
        this.conditions = [];
        this.conditions.push({condition: 'Rent', applied: true});
        this.conditions.push({condition: 'Sale', applied: false});
    }
}

export class BedroomOptionDisplayData {
    allValues: string[];
    selectedValues: string[];

    constructor(allValues: string[], selectedValues: string[]) {
        this.allValues = allValues;
        this.selectedValues = selectedValues;
    }
}

@Injectable()
export class FilterRequest {
    public filterList: Filter[];

    constructor() {
    }
}
