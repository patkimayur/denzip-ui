import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Tag } from '../../models/tag';
import { FormControl } from '@angular/forms';
import { Observable, of, forkJoin } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { map, startWith, catchError } from 'rxjs/operators';
import { UserDisplayInfo, User } from '../../models/user';
import { TagService } from '../../service/tag.service';
import { SECURE_LS } from '../../resources/properties';
import { PageNavigationData } from '../../models/page-navigation-data';
import { Router } from '@angular/router';
import { UserTagDialogComponent } from '../../pages/user-display-details/user-display-details.component';
import { MatSnackbarService } from '../../service/mat-snackbar.service';

@Component({
  selector: 'app-input-tag',
  templateUrl: './input-tag.component.html',
  styleUrls: ['./input-tag.component.css']
})
export class InputTagComponent implements OnInit {

  @Input() dialogRef: MatDialogRef<UserTagDialogComponent>;

  public allTags: Tag[];

  formCtrl = new FormControl();
  filteredTags: Observable<Tag[]>;
  selectedTags: Tag[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private pageNavigationData: PageNavigationData,
    private tagService: TagService, private router: Router, private matSnackbarService: MatSnackbarService) { }

  ngOnInit() {

    if (this.pageNavigationData.allTags && this.pageNavigationData.userTags) {
      this.allTags = this.pageNavigationData.allTags;
      this.selectedTags = this.pageNavigationData.userTags;
    } else {
      if (SECURE_LS && SECURE_LS.get('currentUser')) {
        const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
        const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
        const currentUser: User = JSON.parse(securedCurrentUserStr);
        if (currentUser == null) {
          this.handleError('User not logged in', this.router);
        }
        const allTags = this.tagService.getAllTags();
        const userTags = this.tagService.getUserTags(currentUser.userId);

        allTags.subscribe(res => {
          this.allTags = res;
        });
        userTags.subscribe(res => {
          this.selectedTags = res;
        });
      }
    }

    console.log('All tags are ', this.allTags);
    console.log('User tags are ', this.selectedTags);

    this.filteredTags = this.formCtrl.valueChanges.pipe(
      startWith(null),
      map((value: any) => value ? this.filterAllTags(value) : this.allTags ? this.allTags.slice() : []));
  }

  remove(tag: Tag): void {
    this.selectedTags = this.selectedTags.filter(selectedTag => selectedTag.tagId !== tag.tagId);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.value);
    console.log('selectedTags value: ', this.selectedTags);
    this.tagInput.nativeElement.value = '';
    this.formCtrl.setValue(null);
  }

  private filterAllTags(value: any): Tag[] {
    let filterValue: string;
    if (typeof value === 'string') {
      filterValue = value;
    } else {
      filterValue = value.tagName;
    }

    if (filterValue && filterValue != null && this.allTags) {
      const filterValueLowerCase = filterValue.replace(/ /g, '').toLowerCase();
      this.allTags.filter(tag => tag.tagName.replace(/ /g, '').toLowerCase().indexOf(filterValueLowerCase) === 0);
    }
    return this.allTags ? this.allTags.slice() : [];
  }

  public onSubmit() {

    console.log('Inside onSubmit for user tags');

    const selectedTagIdSet: Set<string> = new Set();
    if (this.selectedTags) {
      this.selectedTags.forEach(tag => selectedTagIdSet.add(tag.tagId));
    }

    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser == null) {
        this.handleError('User not logged in', this.router);
      }

      const selectedTagIdArr: string[] = [];
      selectedTagIdSet.forEach(tagId => selectedTagIdArr.push(tagId));

      console.log('sending updated tags: ', selectedTagIdArr);
      this.tagService.updateUserTags(currentUser.userId, selectedTagIdArr).subscribe(
        result => console.log('Result of updating tags: ', result),
        err => console.log(err),
        () => console.log('Request Completed')
      );

      if (this.dialogRef) {
        this.dialogRef.close();
      }
      // tslint:disable-next-line:max-line-length
      this.matSnackbarService.showSnackbar('Thank you for posting your requirement, you will be notified about prospective properties under \'My Prospective Listings\' page', true);
    }
  }

  handleError(err: string, router: Router) {
    console.error('Handling error: "%s" for current url1: %s', err, router.url);
    router.navigate(['/error']);
    return of(err);
  }


}
