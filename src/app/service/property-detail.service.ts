import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Listing } from '../models/listing';
import { LocalityData } from '../models/locality';
import { LocationData } from '../models/location-data';
import { PageNavigationData } from '../models/page-navigation-data';
import { PropertyInfo } from '../models/property-info';
import { SERVER_BASE_PATH, TITLE } from '../resources/properties';
import { RestClientService } from './rest-client.service';

@Injectable()
export class PropertyDetailService {
  getPropertyDetailUrl: string;
  propertyDetail$: Observable<any>;

  private GET_LOCALITY_DATA = 'getLocalityData';
  private GET_LISTING_DETAIL = 'getListingDetail';

  constructor(private restClientService: RestClientService,
    private actRoute: ActivatedRoute, private router: Router, private pageNavigationData: PageNavigationData) {

  }

  public getLocalityDataFromServer(listingId: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);

    return this.restClientService.executePostCall<LocalityData>(SERVER_BASE_PATH + this.GET_LOCALITY_DATA, body);
  }

  public getListingDetailFromServer(listingId: string) {
    let body = new HttpParams();
    body = body.set('listingId', listingId);

    return this.restClientService.executePostCall<Listing>(SERVER_BASE_PATH + this.GET_LISTING_DETAIL, body);
  }

  getPropertyTitle(): string {
    return this.getListing().listingTitle;
  }

  getListing() {
    return this.pageNavigationData.selectedListing;
  }

  getPropertyAddress(): string {
    return this.getListing().listingAddress;
  }

  getTopBarTitle(): string {
    return TITLE;
  }

  getPropertyValue(): string {
    return String(this.getListing().listingValue);
  }

  getPropertyDeposit(): string {
    return String(this.getListing().listingDeposit);
  }

  getFurnishingType(): string {
    return this.getListing().furnishingType;
  }

  isBachelorAllowed(): boolean {
    return this.getListing().bachelorAllowed;
  }

  isNonVegAllowed(): boolean {
    return this.getListing().nonVegAllowed;
  }

  getTransactionMode(): string {
    return this.getListing().transactionMode;
  }

  getListingArea(): string {
    return String(this.getListing().listingArea);
  }

  getListingPossessionBy(): string {
    return this.getListing().listingPossessionBy;
  }

  getAmenities(): Map<String, Boolean> {
    const listingMap = new Map<String, Boolean>();
    const listingAmenities = this.getListing().listingAmenities;
    console.log('Listing Amenities: ', listingAmenities);
    for (const k of Object.keys(listingAmenities)) {
      listingMap.set(k, listingAmenities[k]);
    }

    if (this.getListing().apartment != null) {
      const apartmentAmenities = this.getListing().apartment.apartmentAmenities;
      for (const k of Object.keys(apartmentAmenities)) {
        listingMap.set(k, apartmentAmenities[k]);
      }

    }
    return listingMap;
  }

  getAmenitiesList(): string[] {
    const amenitiesList: Array<string> = new Array();

    const listingAmenities = this.getListing().listingAmenities;
    console.log('Listing Amenities: ', listingAmenities);
    for (const k of Object.keys(listingAmenities)) {
      if (listingAmenities[k]) {
        amenitiesList.push(k);
      }
    }

    if (this.getListing().apartment != null) {
      const apartmentAmenities = this.getListing().apartment.apartmentAmenities;
      for (const k of Object.keys(apartmentAmenities)) {
        if (apartmentAmenities[k]) {
          amenitiesList.push(k);
        }
      }

    }
    return amenitiesList;
  }

  getLocationData(): LocationData {
    const title = this.getListing().listingTitle;
    const latitude = this.getListing().listingLatitude;
    const longitude = this.getListing().listingLongitude;
    const locationData: LocationData = { title: title, latitude: latitude, longitude: longitude };
    return locationData;
  }

  getLocalityData(): any {
    return this.pageNavigationData.selectedListingLocalityData;
  }
}
