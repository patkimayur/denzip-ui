/// <reference types="@types/googlemaps" />

import { MapsAPILoader } from '@agm/core';
import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, SimpleChange, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_LISTING_TYPE, MARATHAHALLI, KORAMANGALA, BTM } from '../../resources/properties';
import { AlertService } from '../../service/alert.service';
import { Filter, FilterRequest } from '../../models/filter-request';
import { PageNavigationData } from '../../models/page-navigation-data';
import { AbstractReloadableComponent } from '../reloadable-component/abstract-reloadable-component';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';


@Component({
  providers: [NgModel],
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent extends AbstractReloadableComponent implements OnChanges {

  placeResult: google.maps.places.PlaceResult;
  autocomplete: google.maps.places.Autocomplete;
  bedroomCountFilter: Filter;
  listingTypeFilter: Filter;
  selected: string[];
  autocompleteListener;
  selectedListingType: string;
  recentlyAddedListings: number;

  marathahalliCount: number;
  koramangalaCount: number;
  btmCount: number;

  @ViewChild('search')
  searchElementRef: ElementRef;

  @ViewChild('bhkControl')
  bhkControlSelectRef;

  // this is only used for change detection - google geocode async issue
  @Input() pageHeading: string;

  constructor(@Inject(WINDOW) private window: Window,
    private mapsAPILoader: MapsAPILoader,
    private activatedRoute: ActivatedRoute,
    protected router: Router,
    public pageNavigationData: PageNavigationData,
    private cdRef: ChangeDetectorRef, private alertService: AlertService
    , @Inject(PLATFORM_ID) protected platformId: Object) {
    super(router);
    this.pageNavigationData.displayBedroomCountInput = true;
  }

  initialize() {

    console.log('Inside SearchComponent initialize');
    this.selected = [];
    this.selectedListingType = '';
    this.bedroomCountFilter = this.pageNavigationData.bedroomCountFilter;
    this.listingTypeFilter = this.pageNavigationData.listingTypeFilter;
    this.placeResult = this.pageNavigationData.placeResult;
    if (this.pageNavigationData.recentlyAddedListings) {
      this.recentlyAddedListings = this.pageNavigationData.recentlyAddedListings.length;
    }

    if (this.pageNavigationData.areaListingCountMap && this.pageNavigationData.areaListingCountMap != null) {
      this.marathahalliCount = this.pageNavigationData.areaListingCountMap.get(MARATHAHALLI);
      this.koramangalaCount = this.pageNavigationData.areaListingCountMap.get(KORAMANGALA);
      this.btmCount = this.pageNavigationData.areaListingCountMap.get(BTM);
    }

    this.bedroomCountFilter.conditions
      .filter(condition => condition.applied)
      .forEach(condition => this.selected.push(condition.condition));

    this.listingTypeFilter.conditions
      .filter(condition => condition.applied)
      .forEach(condition => this.selectedListingType = condition.condition);

    // If no listingType is selected, default it to Rental
    if (this.selectedListingType === '') {
      this.selectedListingType = DEFAULT_LISTING_TYPE;
    }

    if (isPlatformBrowser(this.platformId)) {
      google.maps.event.addDomListener(this.searchElementRef.nativeElement, 'keydown', function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
        }
      });

      this.mapsAPILoader.load().then(() => this.autoComplete());
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('detecetd change in search component');
    const change = changes['pageHeading'];
    const pageHeading: string = change.currentValue;
    if (pageHeading && pageHeading != null) {
      console.log('change in pageHeading');
      this.searchElementRef.nativeElement.focus();
      this.searchElementRef.nativeElement.blur();
    }
  }

  private autoComplete() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('InsideautoCompleteMethod');
      const bangaloreBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(12.864162, 77.438610),
        new google.maps.LatLng(13.139807, 77.711895));

      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        bounds: bangaloreBounds,
        strictBounds: true,
        types: ['geocode'],
      });

      this.autocomplete.setFields(['geometry.location', 'formatted_address', 'place_id']);

      this.autocompleteListener = this.autocomplete.addListener('place_changed', () => {
        console.log('Invoking getPlace API');
        this.placeResult = this.autocomplete.getPlace();
        console.log('PlaceResult: %s', JSON.stringify(this.placeResult));
      });
    }
  }

  displayBCF(): boolean {
    if (this.pageNavigationData.displayBedroomCountInput) {
      return true;
    }
    return false;
  }

  closeBhkControlSelectRef() {
    this.bhkControlSelectRef.close();
  }

  getLocation() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.window.navigator && this.window.navigator.geolocation) {
        this.window.navigator.geolocation.getCurrentPosition(
          position => {
            console.log(position);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const latlng: google.maps.LatLngLiteral = { lat, lng };

            new google.maps.Geocoder().geocode({ location: latlng }, (results, status) => {
              console.log('GeoResults: ', JSON.stringify(results));
              let filteredResults = results.filter(result => result.types.includes('sublocality_level_5'));

              if (filteredResults == null || filteredResults.length === 0) {
                filteredResults = results.filter(result => result.types.includes('sublocality_level_4'));
              }

              if (filteredResults == null || filteredResults.length === 0) {
                filteredResults = results.filter(result => result.types.includes('sublocality_level_3'));
              }

              if (filteredResults == null || filteredResults.length === 0) {
                filteredResults = results.filter(result => result.types.includes('sublocality_level_2'));
              }

              if (filteredResults == null || filteredResults.length === 0) {
                filteredResults = results.filter(result => result.types.includes('sublocality_level_1'));
              }

              if (filteredResults == null || filteredResults.length === 0) {
                filteredResults = results.filter(result => result.types.includes('sublocality'));
              }

              if (filteredResults == null || filteredResults.length === 0) {
                filteredResults = results;
              }

              const geoCoderResult = filteredResults[0];
              console.log('Filtered GeoResult: ', JSON.stringify(geoCoderResult));
              if (geoCoderResult) {
                this.placeResult = {} as google.maps.places.PlaceResult;
                this.placeResult.formatted_address = geoCoderResult.formatted_address;
                this.placeResult.geometry = {
                  location: geoCoderResult.geometry.location,
                  viewport: geoCoderResult.geometry.viewport
                };
                this.placeResult.place_id = geoCoderResult.place_id;
                this.pageNavigationData.currentSearchLocation = geoCoderResult.formatted_address;
                document.getElementById('search').click();
              } else {
                this.alertService.error('Error occured while trying to detect your location. Please type and we will autosuggest');
              }
            });
          },
          error => {
            switch (error.code) {
              case 1:
                console.log('Permission Denied');
                this.alertService.error('Location permission was denied. Please type and we will autosuggest');
                break;
              case 2:
                console.log('Position Unavailable');
                this.alertService.error('Location position unavilable. Please type and we will autosuggest');
                break;
              case 3:
                console.log('Timeout');
                this.alertService.error('Location position unavilable. Please type and we will autosuggest');
                break;
            }
          }
        );
      }
    }
  }

  onSubmit() {
    if (this.placeResult == null) {
      return;
    }

    this.bedroomCountFilter = this.pageNavigationData.updateBedroomCountFilter(this.selected);
    this.listingTypeFilter = this.pageNavigationData.updateListingTypeFilter(this.selectedListingType);
    console.log('Value of bedroomCountFilter: ', this.bedroomCountFilter);
    console.log('Value of listingTypeFilter: ', this.listingTypeFilter);

    const filterRequest: FilterRequest = new FilterRequest();
    let lat: any;
    let lng: any;
    if (this.placeResult != null && this.placeResult.geometry != null && this.placeResult.geometry.location != null) {
      lat = this.placeResult.geometry.location.lat();
      lng = this.placeResult.geometry.location.lng();
    }
    const filterList: Filter[] = [
      new Filter('com.crs.denzip.persistence.filters.AreaFilter', lat, lng, null),
      this.bedroomCountFilter,
      this.listingTypeFilter
    ];
    filterRequest.filterList = filterList;
    this.pageNavigationData.setFilterRequest(filterRequest);
    console.log('filterRequest: ', this.pageNavigationData.filterRequest);
    this.pageNavigationData.placeResult = this.placeResult;
    this.pageNavigationData.setBedroomCountFilter(this.bedroomCountFilter);
    this.pageNavigationData.setListingTypeFilter(this.listingTypeFilter);

    const placeId = this.pageNavigationData.placeResult.place_id;
    this.pageNavigationData.currentSearchLocation = this.pageNavigationData.placeResult.formatted_address;

    this.router.navigate(['/listing-summary'],
      {
        queryParams: {
          'placeId': placeId, 'lat': lat, 'lng': lng, 'bhk': this.selected.join(),
          'listingType': this.selectedListingType
        }
      });
  }

  navigateToRecentlyAdded() {
    console.log('navigate to recently added listings');
    this.router.navigate(['/recentListings']);
  }

  navigateToAllMarathahalli() {
    const placeId = 'ChIJVwkdVbQTrjsRGUkefteUeFk';
    const lat = 12.9591722;
    const lng = 77.69741899999997;

    this.router.navigate(['/listing-summary'],
      {
        queryParams: {
          'placeId': placeId, 'lat': lat, 'lng': lng, 'bhk': this.selected.join(),
          'listingType': DEFAULT_LISTING_TYPE, extendedSearch: true
        }
      });
  }

  navigateToAllKoramangala() {
    const placeId = 'ChIJLfyY2E4UrjsRVq4AjI7zgRY';
    const lat = 12.9352273;
    const lng = 77.62443310000003;

    this.router.navigate(['/listing-summary'],
      {
        queryParams: {
          'placeId': placeId, 'lat': lat, 'lng': lng, 'bhk': this.selected.join(),
          'listingType': DEFAULT_LISTING_TYPE, extendedSearch: true
        }
      });
  }

  navigateToAllBTM() {
    const placeId = 'ChIJMTCpkfwUrjsRP9zLdiXmr_A';
    const lat = 12.9165757;
    const lng = 77.61011630000007;

    this.router.navigate(['/listing-summary'],
      {
        queryParams: {
          'placeId': placeId, 'lat': lat, 'lng': lng, 'bhk': this.selected.join(),
          'listingType': DEFAULT_LISTING_TYPE, extendedSearch: true
        }
      });
  }
}
