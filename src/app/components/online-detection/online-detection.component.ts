import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ConnectionService } from 'ng-connection-service';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SNACKBAR_DURATION } from '../../resources/properties';

@Component({
  selector: 'app-online-detection',
  templateUrl: './online-detection.component.html',
  styleUrls: ['./online-detection.component.css']
})
export class OnlineDetectionComponent implements OnInit {

  status = 'Connection Online';
  isConnected = true;
  success = true;

  constructor(private connectionService: ConnectionService, private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.connectionService.monitor().subscribe(isConnected => {
        this.isConnected = isConnected;
        if (this.isConnected) {
          this.status = 'Connection Online';
          this.success = true;
        } else {
          this.status = 'Connection Offline';
          this.success = false;
        }
        this.showSnackbar(this.status, this.success);
      });
    }
  }

  ngOnInit() {
  }

  public showSnackbar(message: string, success: boolean) {
    const panelClass = ['crs-mat-snackbar'];
    success ? panelClass.push('bg-success') : panelClass.push('bg-danger');
    const config: MatSnackBarConfig = {
      panelClass: panelClass,
      verticalPosition: 'top'
    };
    if (success) {
      config.duration = SNACKBAR_DURATION;
    }
    this.snackBar.open(message, null, config);
  }

}
