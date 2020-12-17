import { Component, OnInit, Input } from '@angular/core';
import { Listing } from '../../models/listing';

@Component({
  selector: 'app-error-search-listing',
  templateUrl: './error-search-listing.component.html',
  styleUrls: ['./error-search-listing.component.css']
})
export class ErrorSearchListingComponent implements OnInit {

  @Input() listings: Listing[];

  constructor() { }

  ngOnInit() {
  }

}
