import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BrokerOrg } from '../../models/broker-org';
import { BrokerOrgService } from '../../service/broker-org.service';
import { Tag } from '../../models/tag';
import { Observable } from 'rxjs';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { PageNavigationData } from '../../models/page-navigation-data';
import { TagService } from '../../service/tag.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broker-org-reg',
  templateUrl: './broker-org-reg.component.html',
  styleUrls: ['./broker-org-reg.component.css']
})
export class BrokerOrgRegComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  brokerOrg: BrokerOrg = new BrokerOrg();
  email: string;

  public allTags: Tag[];
  filteredTags: Observable<Tag[]>;
  selectedTags: Tag[] = [];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private pageNavigationData: PageNavigationData,
    private tagService: TagService, private formBuilder: FormBuilder, private brokerOrgService: BrokerOrgService,
    private matSnackbarService: MatSnackbarService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      brokerOrgName: ['', Validators.required],
      brokerOrgAddress: [''],
      formCtrl: [''],
      phoneNumber: ['', Validators.required],
      email: ['']
    });

    if (this.pageNavigationData.allTags && this.pageNavigationData.userTags) {
      this.allTags = this.pageNavigationData.allTags;
      this.selectedTags = this.pageNavigationData.userTags;
    } else {
      const allTags = this.tagService.getAllTags();
      allTags.subscribe(res => {
        this.allTags = res;
      });
    }

    this.filteredTags = this.loginForm.valueChanges.pipe(
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
    this.f.formCtrl.setValue(null);
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

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }


    this.loading = true;
    this.brokerOrg.brokerOrgEmail = this.f.email.value;
    this.brokerOrg.brokerOrgMobile = this.f.phoneNumber.value;
    this.brokerOrg.brokerOrgName = this.f.brokerOrgName.value;
    this.brokerOrg.brokerOrgAddress = this.f.brokerOrgAddress.value;

    console.log('Inside onSubmit for broker tags');

    const selectedTagIdSet: Set<string> = new Set();
    if (this.selectedTags) {
      this.selectedTags.forEach(tag => selectedTagIdSet.add(tag.tagId));
    }

    const selectedTagIdArr: string[] = [];
    selectedTagIdSet.forEach(tagId => selectedTagIdArr.push(tagId));

    this.brokerOrg.tags = selectedTagIdArr.join(',');

    console.log('sending updated broker tags: ', selectedTagIdArr);

    if (selectedTagIdArr.length === 0) {
      this.f.formCtrl.setErrors({
        required: true
      });
      this.loading = false;
      return;
    }

    console.log('Broker Org details updated from form data: ', JSON.stringify(this.brokerOrg));

    this.brokerOrgService.registerBrokerOrg(this.brokerOrg).subscribe(
      data => {
        if (data) {
          this.matSnackbarService.showSnackbar('Broker Org added successfully', true);
          this.router.navigate(['/home']);
        } else {
          this.matSnackbarService.showSnackbar('Unable to add Broker Org', false);
        }
      });
  }
}
