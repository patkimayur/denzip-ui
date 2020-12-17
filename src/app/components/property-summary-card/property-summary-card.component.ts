
import { MatDialog } from '@angular/material/dialog';
import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Listing } from '../../models/listing';
import { ListingDetailRequest } from '../../models/listing-detail-request';
import { PageNavigationData } from '../../models/page-navigation-data';
import { ListingSummaryService } from '../../service/listing-summary.service';
import { ListingUserRelationService } from '../../service/listing-user-relation.service';
import { MatSnackBar } from '@angular/material';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-property-summary-card',
  templateUrl: './property-summary-card.component.html',
  styleUrls: ['./property-summary-card.component.css']
})
export class PropertySummaryCardComponent implements OnInit, AfterViewChecked {

  @Input() hideUnShortlistedListings = false;
  @Input() listings: Listing[];
  currentUserId;



  constructor(@Inject(WINDOW) private window: Window, private listingSummaryService: ListingSummaryService, private router: Router,
    private listingDetailRequest: ListingDetailRequest, private pageNavigationData: PageNavigationData,
    private listingUserRelationService: ListingUserRelationService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) {
    console.log('Inside PropertySummaryCardComponent constructor');
    this.pageNavigationData.displayBedroomCountInput = false;
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  redirect(listing: Listing) {
    this.listingDetailRequest.listingId = listing.listingId;
    this.pageNavigationData.selectedListing = listing;
    if (isPlatformBrowser(this.platformId)) {
    this.window.open('/listing-detail/' + listing.listingId, '_blank');
    }
  }

}
