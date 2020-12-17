import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractReloadableComponent } from '../../components/reloadable-component/abstract-reloadable-component';
import { Listing } from '../../models/listing';
import { PageNavigationData } from '../../models/page-navigation-data';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent extends AbstractReloadableComponent {

  listings: Listing[];

  constructor(private pageNavigationData: PageNavigationData, protected router: Router) {
    super(router);
  }

  initialize() {
    console.log('Owner listing reinitialized');
    this.listings = this.pageNavigationData.listings;
  }

}
