import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CashService } from '../services/cashs/cash.service';
// import { Cash } from '../models/cashs/cash.types';
import { CreateCashComponent } from './create-cash/create-cash.component';

@Component({
  selector: 'app-cashs',
  templateUrl: './cashs.component.html',
  styleUrls: ['./cashs.component.scss']
})
export class CashsComponent implements OnInit {

  @ViewChild('cashsTable', { read: MatSort }) cashsTableSort: MatSort;


  cashsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  cashsTableColumns: string[] = ["description", "currencyCode", "currency", "amount", "status", "action"];

  isLoading: boolean = true;
  cashs: any[];

  constructor(private _userService: UserService, private _cashService: CashService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.getCashs();
  }

  getCashs() {
    this._cashService.getCashs().subscribe((cashs: any) => {
      this.cashsDataSource.data = cashs;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.cashsDataSource.sort = this.cashsTableSort;
  }

  openCreateCashDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateCashComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getCashs();
      });
  }

  openEditCashDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateCashComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getCashs();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this item ?",
      title: "Delete Cash Confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleCash(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Cash delete canceled')
      }
    });
  }

  deteleCash(id: string) {
    this.isLoading = true;
    this._cashService.deleteCash(id).subscribe(response => {
      this._alertService.displayMessage('Cash Deleted');
      this.getCashs();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Try again')
    })
  }

}
