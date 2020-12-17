import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import {PropertyDetailService} from '../../service/property-detail.service';
import { UtilsService } from '../../service/utils.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-info-grid',
  templateUrl: './info-grid.component.html',
  styleUrls: ['./info-grid.component.css'],
})
export class InfoGridComponent implements OnInit {

  properties: any[];
  furnishingType;
  tenantPreference;
  foodPreference;
  transactionMode;
  listingArea;
  isListingRental: boolean;
  isListingSale: boolean;
  listingPossessionBy: string;

  constructor(private propertyDetailService: PropertyDetailService, private utilsService: UtilsService,
    @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit() {
    this.furnishingType = 'Furnishing: '.concat(this.propertyDetailService.getFurnishingType());
    this.tenantPreference = 'Suitable For: '.concat(this.propertyDetailService.isBachelorAllowed() ? 'Families & Bachelors' : 'Families');
    this.foodPreference = 'Food Habits: '.concat(this.propertyDetailService.isNonVegAllowed() ? 'Veg & Non-Veg' : 'Veg Only');
    this.transactionMode = 'Rent Payment: '.concat(this.propertyDetailService.getTransactionMode());
    this.listingArea = 'Property Area: '.concat(this.propertyDetailService.getListingArea(), ' Sq. Feet');

    let possessionBy = this.propertyDetailService.getListingPossessionBy();
    if (possessionBy) {
      possessionBy = formatDate(possessionBy, 'MMM yyyy', this.locale);
      console.log('possessionBy: ', possessionBy);
      this.listingPossessionBy = 'Possession By: '.concat(possessionBy);
    }


    this.isListingRental = this.utilsService.isListingRental(this.propertyDetailService.getListing());
    this.isListingSale = this.utilsService.isListingSale(this.propertyDetailService.getListing());
  }

}
