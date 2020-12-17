import { Component, Input, OnInit } from '@angular/core';
import { Listing } from '../../models/listing';
import { UtilsService } from '../../service/utils.service';

@Component({
  selector: 'app-text-grid',
  templateUrl: './app-text-grid.component.html',
  styleUrls: ['./app-text-grid.component.css'],
})
export class TextGridComponent implements OnInit {

  @Input() listing: Listing;
  @Input() showLaunchIcon: boolean;
  propertyTitle: string;
  propertyValue: string;
  propertyDeposit: string;
  isListingRental: boolean;
  isListingSale: boolean;

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
    this.propertyTitle = this.listing.listingTitle;
    const brokerListing = this.listing.createdUserAuthorityNames.findIndex(name => name.includes('ROLE_BROKER')) === -1 ? false : true;
    if (brokerListing) {
      this.propertyTitle = this.propertyTitle + ' (BROKER PROPERTY - CHARGES APPLY)';
    }
    this.propertyValue = String(this.listing.listingValue);
    this.propertyDeposit = String(this.listing.listingDeposit);
    this.isListingRental = this.utilsService.isListingRental(this.listing);
    this.isListingSale = this.utilsService.isListingSale(this.listing);
  }

}
