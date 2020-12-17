import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BrokerOrg } from '../../models/broker-org';
import { BrokerOrgService } from '../../service/broker-org.service';
import { Router } from '@angular/router';
import { MatSnackbarService } from '../../service/mat-snackbar.service';

@Component({
  selector: 'app-broker-org-mapping',
  templateUrl: './broker-org-mapping.component.html',
  styleUrls: ['./broker-org-mapping.component.css']
})
export class BrokerOrgMappingComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  brokerOrg: BrokerOrg = new BrokerOrg();

  constructor(private formBuilder: FormBuilder, private brokerOrgService: BrokerOrgService,
    private matSnackbarService: MatSnackbarService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      brokerOrgPhoneNumber: ['', Validators.required],
      brokerPhoneNumbers: ['', Validators.required],
    });
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

    this.brokerOrg.brokerOrgMobile = this.f.brokerOrgPhoneNumber.value;
    this.brokerOrg.brokerPhoneNumbers = this.f.brokerPhoneNumbers.value;

    console.log('Broker Org mapping details updated from form data: ', JSON.stringify(this.brokerOrg));

    this.brokerOrgService.registerBrokerOrgMapping(this.brokerOrg).subscribe(
      data => {
        if (data) {
          this.matSnackbarService.showSnackbar('Broker Org mapping added successfully', true);
          this.router.navigate(['/home']);
        } else {
          this.matSnackbarService.showSnackbar('Unable to add Broker Org mapping', false);
        }
      });
  }
}
