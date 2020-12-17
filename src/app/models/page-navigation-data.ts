/// <reference types="@types/googlemaps" />


import { Injectable } from '@angular/core';
import { Apartment } from './apartment';
import { Filter, FilterRequest } from './filter-request';
import { Listing } from './listing';
import { User } from './user';
import { LocalityData } from './locality';
import { Tag } from './tag';
import { BrokerOrg } from './broker-org';
import { CountEntity } from './count-entity';


@Injectable()
export class PageNavigationData {
    filterRequest: FilterRequest;
    bedroomCountFilter: Filter;
    placeResult: google.maps.places.PlaceResult;
    currentSearchLocation: string;
    listings: Listing[];
    selectedListing: Listing;
    selectedListingLocalityData: LocalityData;
    allApartments: Apartment[]; // For add listing
    displayBedroomCountInput: boolean;
    selectedApartment: Apartment; // For add apartment
    userCreateInProgress: User;
    allTags: Tag[];
    userTags: Tag[];
    listingTypeFilter: Filter;
    listingSummaryPageHeading: string;
    brokerOrg: BrokerOrg;
    recentlyAddedListings: Listing[];
    areaListingCountMap: Map<string, number>;
    countEntity: CountEntity;

    public setFilterRequest(filterRequest: FilterRequest) {
        console.log('Setting value: ', filterRequest);
        this.filterRequest = filterRequest;
        return this;
    }

    public setBedroomCountFilter(bedroomCountFilter: Filter) {
        console.log('Setting value: ', bedroomCountFilter);
        this.bedroomCountFilter = bedroomCountFilter;
        return this;
    }

    public setListings(listings: Listing[]) {
        console.log('Setting value: ', listings);
        this.listings = listings;
        return this;
    }

    public setSelectedListing(listing: Listing) {
        console.log('Setting value: ', listing);
        this.selectedListing = listing;
        return this;
    }

    public setLocalityData(localityData: LocalityData) {
        console.log('Setting value: ', localityData);
        this.selectedListingLocalityData = localityData;
        return this;
    }

    public setSelectedApartment(apartment: Apartment) {
        console.log('Setting value: ', apartment);
        this.selectedApartment = apartment;
        return this;
    }

    public setUserCreateInProgress(user: User) {
        console.log('Setting value: ', user);
        this.userCreateInProgress = user;
        return this;
    }

    public setPlaceResult(placeResultIn: google.maps.places.PlaceResult) {
        console.log('Setting value: ', placeResultIn);
        this.placeResult = placeResultIn;
        return this;
    }

    public setCurrentSearchLocation(currentSearchLocationIn: string) {
        console.log('Setting value: ', currentSearchLocationIn);
        this.currentSearchLocation = currentSearchLocationIn;
        return this;
    }

    public updateBedroomCountFilter(selectedValues: string[]) {
        for (const condition of this.bedroomCountFilter.conditions) {
            if (selectedValues.indexOf(condition.condition) !== -1) {
                condition.applied = true;
            } else {
                condition.applied = false;
            }
        }
        return this.bedroomCountFilter;
    }

    public setAllApartments(allApartments: Apartment[]) {
        console.log('Setting value: ', allApartments);
        this.allApartments = allApartments;
        return this;
    }

    public setAllTags(allTags: Tag[]) {
        console.log('Setting value: ', allTags);
        this.allTags = allTags;
        return this;
    }

    public setUserTags(userTags: Tag[]) {
        console.log('Setting value: ', userTags);
        this.userTags = userTags;
        return this;
    }

    public setListingTypeFilter(listingTypeFilter: Filter) {
        console.log('Setting value: ', listingTypeFilter);
        this.listingTypeFilter = listingTypeFilter;
        return this;
    }

    public updateListingTypeFilter(selectedValue: string) {
        for (const condition of this.listingTypeFilter.conditions) {
            if (selectedValue.indexOf(condition.condition) !== -1) {
                condition.applied = true;
            } else {
                condition.applied = false;
            }
        }
        return this.listingTypeFilter;
    }

    public setBrokerOrg(brokerOrg: BrokerOrg) {
        console.log('Setting value: ', brokerOrg);
        this.brokerOrg = brokerOrg;
        return this;
    }

    public setRecentlyAddedListings(recentlyAddedListings: Listing[]) {
        console.log('Setting value: ', recentlyAddedListings);
        this.recentlyAddedListings = recentlyAddedListings;
        return this;
    }

    public setAreaListingCountMap(areaListingCountMap: Map<string, number>) {
        console.log('Setting value: ', areaListingCountMap);
        this.areaListingCountMap = areaListingCountMap;
        return this;
    }

    public setCountEntity(countEntity: CountEntity) {
      console.log('Setting value: ', countEntity);
      this.countEntity = countEntity;
      return this;
  }
}
