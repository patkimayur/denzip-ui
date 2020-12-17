import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SortDataWrapper } from '../../models/sort-data';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit {

  @Input() sortDataWrapper: SortDataWrapper;
  @Output() updatedSortKeyEvent = new EventEmitter<string>();

  selectedSortKey: string;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SortDialogComponent, {
      width: 'auto',
      height: '350px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      autoFocus: false,
      data: this.sortDataWrapper
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        console.log('Applied sort key: %s', result);
        this.selectedSortKey = result;
        this.sendMessage();
      }
    });
  }

  sendMessage() {
    this.updatedSortKeyEvent.emit(this.selectedSortKey);
  }

}

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortDialogComponent implements OnInit {

  sortDataWrapper: SortDataWrapper;
  appliedSortKey: string;

  constructor(
    public dialogRef: MatDialogRef<SortDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.sortDataWrapper = this.data;
    console.log('sortDataWrapper: %s', JSON.stringify(this.sortDataWrapper));

    this.appliedSortKey = this.sortDataWrapper.lastSelectedSortKey;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

