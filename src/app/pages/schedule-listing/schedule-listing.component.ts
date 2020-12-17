import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractReloadableComponent } from '../../components/reloadable-component/abstract-reloadable-component';
import { Listing } from '../../models/listing';
import { PageNavigationData } from '../../models/page-navigation-data';

@Component({
  selector: 'app-schedule-listing',
  templateUrl: './schedule-listing.component.html',
  styleUrls: ['./schedule-listing.component.css']
})
export class ScheduleListingComponent extends AbstractReloadableComponent {

  listings: Listing[];

  constructor(protected router: Router, private pageNavigationData: PageNavigationData) {
    super(router);
  }

  initialize() {
    console.log('Invoking initilize of ScheduleListingComponent');
    this.listings = this.pageNavigationData.listings;
  }

}
