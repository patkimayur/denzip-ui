import { Component, Input, OnInit } from '@angular/core';
import { Listing } from '../../models/listing';

@Component({
  selector: 'app-interested-users',
  templateUrl: './interested-users.component.html',
  styleUrls: ['./interested-users.component.css']
})
export class InterestedUsersComponent implements OnInit {

  @Input() listing: Listing;
  message: string;

  constructor() { }

  ngOnInit() {
    let userInterestCount = this.listing.usersInterestedCount;
    // Now there is always a relationshsip in table against owner as well so we need to substract 1 right away
    userInterestCount = userInterestCount - 1;
    if (userInterestCount === 1) {
      this.message = '1 user is interested in this property';
    } else if (userInterestCount > 1) {
      this.message = userInterestCount + ' users are interested in this property';
    }
  }

}
