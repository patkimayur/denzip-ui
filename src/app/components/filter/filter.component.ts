import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageNavigationData } from '../../models/page-navigation-data';
import { Filter } from '../../models/filter-request';
import { FilterService } from '../../service/filter.service';
import { AbstractReloadableComponent } from '../reloadable-component/abstract-reloadable-component';
import { LISTING_TYPE_SALE } from '../../resources/properties';
import { UtilsService } from '../../service/utils.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent extends AbstractReloadableComponent implements OnChanges {

  filterList: Filter[];
  // placeResult property is needed to fire an event whenever parent changes and filters have to be reinitialized
  @Input() placeResult: any;
  // updtaedFilterEvent is needed to send appliedFilters to parent
  @Output() updatedFilterEvent = new EventEmitter<Filter[]>();

  constructor(private dialog: MatDialog, private filterService: FilterService, protected router: Router,
    private pageNavigationData: PageNavigationData, private utilsService: UtilsService) {
    super(router);
    console.log('Inside FilterComponent constructor');
  }

  initialize() {
    this.invokeFilterService();
    console.log('FilterList reinitialized');
  }

  // We need ngOnChanges so that when parent page property changes, we reinitialize filters
  // For listingSummary, this would be placeResult
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.initialize();
  }

  private invokeFilterService() {
    this.filterService.getFilters().subscribe(
      data => {
        this.filterList = data.filterList;
        if (this.pageNavigationData && this.pageNavigationData.bedroomCountFilter) {
          this.filterList.push(this.pageNavigationData.bedroomCountFilter);
        }

        console.log(this.filterList);

        const listingTypeName = this.utilsService.getListingTypeFromFilter(this.pageNavigationData.listingTypeFilter);
        if (LISTING_TYPE_SALE === listingTypeName) {
          this.filterList = this.filterList.filter(filter => filter.title !== 'Transaction Mode'
            && filter.title !== 'Food Preference'
            && filter.title !== 'Tenant Preference');
        }
      },
      err => console.log(err),
      () => console.log('Request Completed')
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      autoFocus: false,
      data: JSON.parse(JSON.stringify({
        'filterList': this.filterList,
        'listingTypeFilter': this.pageNavigationData.listingTypeFilter
      })) // deep clone to maintain the original list in case of dialog close
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log('AppliedFilters: %s', JSON.stringify(result));
        this.filterList = result;
        this.sendMessage();
      }
    });
  }

  sendMessage() {
    this.updatedFilterEvent.emit(this.filterList);
  }

}

@Component({
  selector: 'app-filter-dialog-component',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterDialogComponent implements OnInit {

  // This is for slider
  listingValueRangeConfig: any;

  filters: Filter[];
  listingTypeFilter: Filter;

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private utilsService: UtilsService) { }

  ngOnInit() {
    this.filters = this.data.filterList;
    this.listingTypeFilter = this.data.listingTypeFilter;
    const listingTypeName = this.utilsService.getListingTypeFromFilter(this.listingTypeFilter);
    if (LISTING_TYPE_SALE === listingTypeName) {
      this.listingValueRangeConfig = {
        behaviour: 'drag',
        connect: true,
        margin: 500000,
        step: 100000,
        range: {
          min: 0,
          max: 50000000
        },
        pips: {
          mode: 'count',
          values: 6
        },
        tooltips: [true, true],
      };
    } else {
      this.listingValueRangeConfig = {
        behaviour: 'drag',
        connect: true,
        margin: 5000,
        step: 1000,
        range: {
          min: 0,
          max: 200000
        },
        pips: {
          mode: 'count',
          values: 5
        },
        tooltips: [true, true],
      };
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
