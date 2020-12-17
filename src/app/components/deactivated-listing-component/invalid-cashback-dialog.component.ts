import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject, Component, OnInit, HostListener } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-invalid-deactivation-dialog',
  templateUrl: 'invalid-cashback-dialog.component.html',
})
export class InvalidCashbackDeactivationDialogComponent implements OnInit {

  constructor(@Inject(WINDOW) private window: Window, 
    public dialogRef: MatDialogRef<InvalidCashbackDeactivationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
    }

  ngOnInit() {
  }

  storeResultForIc(): void {
    this.dialogRef.close(true);
  }

  onNoClickForIc(): void {
    this.dialogRef.close();
  }
}
