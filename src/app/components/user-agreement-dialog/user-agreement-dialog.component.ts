import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-user-agreement-dialog',
  templateUrl: './user-agreement-dialog.component.html',
  styleUrls: ['./user-agreement-dialog.component.css']
})
export class UserAgreementDialogComponent implements OnInit {

  fromDialog = false;

  constructor(@Inject(WINDOW) private window: Window, 
    public dialogRef: MatDialogRef<UserAgreementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.fromDialog) {
      this.fromDialog = true;
    }
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  storeResult(): void {
    this.dialogRef.close(true);
  }

}
