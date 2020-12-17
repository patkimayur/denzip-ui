import { Component, OnInit } from '@angular/core';
import { Listing } from '../../models/listing';
import { PageNavigationData } from '../../models/page-navigation-data';
import { AbstractReloadableComponent } from '../../components/reloadable-component/abstract-reloadable-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shortlisted-listing',
  templateUrl: './shortlisted-listing.component.html',
  styleUrls: ['./shortlisted-listing.component.css']
})
export class ShortlistedListingComponent extends AbstractReloadableComponent {

  listings: Listing[];

  constructor(protected router: Router, private pageNavigationData: PageNavigationData) {
    super(router);
  }

  initialize() {
    this.listings = this.pageNavigationData.listings;
  }

}
