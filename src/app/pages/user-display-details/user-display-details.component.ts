import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, of, forkJoin } from 'rxjs';
import { map, startWith, catchError } from 'rxjs/operators';
import { PageNavigationData } from '../../models/page-navigation-data';
import { Tag } from '../../models/tag';
import { UserDisplayInfo, User } from '../../models/user';
import { TagService } from '../../service/tag.service';
import { SECURE_LS } from '../../resources/properties';
import { Router } from '@angular/router';
import { InputTagComponent } from '../../components/input-tag/input-tag.component';

@Component({
  selector: 'app-user-display-details',
  templateUrl: './user-display-details.component.html',
  styleUrls: ['./user-display-details.component.css']
})
export class UserDisplayDetailsComponent implements OnInit {

  public username: string = this.user.userName;
  public email: string = this.user.userEmail;
  public phoneNumber: number = this.user.userMobile;

  constructor(private user: UserDisplayInfo) {
  }

  ngOnInit(): void {
  }
}

@Component({
  selector: 'app-user-tag-dialog',
  templateUrl: './user-tag-dialog.component.html',
  styleUrls: ['./user-display-details.component.css']
})
export class UserTagDialogComponent implements OnInit {

  formCtrl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<UserTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public inputTagComp: InputTagComponent,
    private pageNavigationData: PageNavigationData,
    private tagService: TagService, private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.inputTagComp.onSubmit();
    console.log('submit for user location tagging completed');
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

