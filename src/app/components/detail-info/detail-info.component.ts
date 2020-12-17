import { Component, OnInit, Input } from '@angular/core';
import { Listing } from '../../models/listing';

@Component({
  selector: 'app-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.css']
})
export class DetailInfoComponent implements OnInit {

  @Input() listing: Listing;
  propertyDetail: string;
  detailList: string[] = [];

  constructor() { }

  ngOnInit() {
    this.propertyDetail = this.listing.listingAddress;
    if (this.propertyDetail) {
      this.propertyDetail.split('\n').forEach(detail => {
        const trimmedDetail = detail.trim();
        if (trimmedDetail !== '') {
          this.detailList.push(detail.trim());
        }
      });
    }
  }

}
