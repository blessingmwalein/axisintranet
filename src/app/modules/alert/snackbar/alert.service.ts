import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar) {
  }

  public displayMessage(message: string, timeout?: number): void {
    this.snackBar.open(`Request Successful: ${message}`, '', {
      duration: timeout ?? environment.snackBarTimeout,
      panelClass: ['mat-toolbar', 'mat-success']
    });
  }

  public displayError(error: string): void {
    this.snackBar.open(`Something went wrong! ${error?.toString()}`, '', {
      duration: environment.snackBarTimeout,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

}
