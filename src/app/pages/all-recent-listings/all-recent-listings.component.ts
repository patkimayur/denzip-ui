import { Component, OnInit } from '@angular/core';
import { PageNavigationData } from '../../models/page-navigation-data';
import { Listing } from '../../models/listing';
import { SECURE_LS } from '../../resources/properties';
import { MatDialog } from '@angular/material';
import { SignInComponent } from '../sign-in/sign-in.component';
import { User } from '../../models/user';
import { UserTagDialogComponent } from '../user-display-details/user-display-details.component';

@Component({
  selector: 'app-all-recent-listings',
  templateUrl: './all-recent-listings.component.html',
  styleUrls: ['./all-recent-listings.component.css']
})
export class AllRecentListingsComponent implements OnInit {

  listings: Listing[];
  checkUserTagDialogLoginSuccessful: boolean;
  constructor(private pageNavigationData: PageNavigationData, public dialog: MatDialog) { }

  ngOnInit() {
    this.listings = this.pageNavigationData.recentlyAddedListings;
    if (this.checkUserTagDialogLoginSuccessful) {
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        console.log('trying to open user tag dialog');
        this.openUserTagComponent();
      }
      this.checkUserTagDialogLoginSuccessful = false;
    }
  }

  openPostRequirementDialog() {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      this.openUserTagComponent();
    } else {
      console.log('No current user found');
      console.log('The return url from post requirement is : ', location.pathname + location.search);
      const dialogRef = this.dialog.open(SignInComponent, {
        width: '400px',
        disableClose: true,
        data: { returnUrl: location.pathname + location.search },
        autoFocus: false
      });

      this.checkUserTagDialogLoginSuccessful = true;

    }
  }

  openUserTagComponent() {
    const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
    const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
    const currentUser: User = JSON.parse(securedCurrentUserStr);
    if (currentUser.userId) {
      const dialogRef = this.dialog.open(UserTagDialogComponent, {
        width: '600px',
        disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vh',
      });
    }
  }

}
