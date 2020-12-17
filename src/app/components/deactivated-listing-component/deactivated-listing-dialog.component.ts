import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-deactivation-dialog',
  templateUrl: 'deactivated-listing-dialog.component.html',
})
export class DeactivationDialogComponent implements OnInit {

  denzipUserValidations: FormGroup;
  options: boolean;


  constructor(@Inject(WINDOW) private window: Window, 
    public dialogRef: MatDialogRef<DeactivationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) { }

    @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
    }


  ngOnInit() {
    this.denzipUserValidations = this.formBuilder.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]]
    });

  }

  clearValidation(): void {
    this.denzipUserValidations = this.formBuilder.group({
      mobileNumber: ['', []]
    });
  }

  storeResult(): void {
    if (null != this.denzipUserValidations && this.denzipUserValidations.invalid) {
      return;
    }
    if (!this.options) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(this.denzipUserValidations.value.mobileNumber);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public keyPress(event: any) {
    if (event.charCode !== 0) {
      const pattern = /[0-9]/;

      const inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode !== 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

}

