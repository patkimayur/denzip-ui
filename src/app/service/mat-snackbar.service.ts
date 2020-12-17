import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SNACKBAR_DURATION } from '../resources/properties';
import { TitleCasePipe } from '@angular/common';




@Injectable()
export class MatSnackbarService {

    constructor(private snackBar: MatSnackBar, private titleCasePipe: TitleCasePipe) { }

    public showSnackbar(message: string, success: boolean) {
        const panelClass = ['crs-mat-snackbar'];
        success ? panelClass.push('bg-success') : panelClass.push('bg-danger');
        this.snackBar.open(this.titleCasePipe.transform(message), null, {
          duration: SNACKBAR_DURATION,
          panelClass: panelClass
        });
      }

}
