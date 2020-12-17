import { AfterViewChecked, ChangeDetectorRef, Component, Inject, HostListener, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractReloadableComponent } from '../../components/reloadable-component/abstract-reloadable-component';
import { Listing } from '../../models/listing';
import { PageNavigationData } from '../../models/page-navigation-data';
import { MetaService } from '../../service/meta.service';
import { UtilsService } from '../../service/utils.service';
import { SECURE_LS } from '../../resources/properties';
import { User } from '../../models/user';
import { UserService } from '../../service/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignInComponent } from '../sign-in/sign-in.component';
import { AlertService } from '../../service/alert.service';


@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent extends AbstractReloadableComponent implements AfterViewChecked {

  listing: Listing;
  selectedLocalityCategoryIndex = 0;

  constructor(protected router: Router,
    private pageNavigationData: PageNavigationData,
    private cdRef: ChangeDetectorRef, private metaService: MetaService, private utilsService: UtilsService,
    public dialog: MatDialog, private userService: UserService, public alertService: AlertService) {
    super(router);
    console.log('Inside PropertyDetailComponent constructor');
  }

  initialize() {
    console.log('Inside PropertyDetailComponent initialize');
    const identifier = this.utilsService.isListingRental(this.pageNavigationData.selectedListing) ? ', Rent - ' : ', Cost - ';
    const title = this.pageNavigationData.selectedListing.listingTitle + identifier + this.pageNavigationData.selectedListing.listingValue;
    this.metaService.updateTitle(title + ' | ' + this.metaService.getTitle());
    this.listing = this.pageNavigationData.selectedListing;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  selectedCategoryIndexUpdateHandler($event: any) {
    this.selectedLocalityCategoryIndex = $event;
  }

}
