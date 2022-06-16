import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
// import { Asset } from '../models/assets/asset.types';
import { AssetService } from '../services/assets/asset.service';
import { CreateAssetComponent } from './create-asset/create-asset.component';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  @ViewChild('assetsTable', { read: MatSort }) assetsTableSort: MatSort;


  assetsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  assetsTableColumns: string[] = ["description", "serialNumber",  "assetCode","status", "action"];

  isLoading: boolean = true;
  assets: any[];

  constructor(private _userService: UserService, private _assetService: AssetService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.getAssets();
  }

  getAssets() {
    this._assetService.getAssets().subscribe((assets: any) => {
      this.assetsDataSource.data = assets;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.assetsDataSource.sort = this.assetsTableSort;
  }

  openCreateAssetDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateAssetComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getAssets();
      });
  }

  openEditAssetDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateAssetComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getAssets();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this item ?",
      title: "Delete Asset Confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleAsset(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Asset delete canceled')
      }
    });
  }

  deteleAsset(id: string) {
    this.isLoading = true;
    this._assetService.deleteAsset(id).subscribe(response => {
      this._alertService.displayMessage('Asset Deleted');
      this.getAssets();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Try again')
    })
  }

}
