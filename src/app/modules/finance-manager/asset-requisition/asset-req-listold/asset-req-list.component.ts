import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { AssetRequisitionService } from 'app/modules/employee-x/services/asset-requisitions/asset-requisitions.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-asset-req-list',
  templateUrl: './asset-req-list.component.html',
  styleUrls: ['./asset-req-list.component.scss']
})
export class AssetReqListComponent implements OnInit {

  assetRequisitions: any[];
  assetReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
  assetReqTableColumns: string[] = ["title", "status", "duration", 'startDate', "asset", "endDate", "action"];
  isLoading: boolean = true;
  status = "employee";

  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _assetRequisitionService: AssetRequisitionService,
    private _alertService: AlertService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
  }


  ngOnInit(): void {
    this.getAssetReqs()
  }

  getAssetReqs() {
    this.isLoading = true;
    this._assetRequisitionService.getFilteredAssetRequisitionsLogged(this.status == "employee" ? false :true).subscribe(response => {
      this.assetReqDataSource.data = response;
      console.log(this.assetReqDataSource.data);
      this.isLoading = false
    }, error => {
      console.log(error);
      this._alertService.displayError("Could not fetch asset requisitions reload!")
      this.isLoading = false
    })
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  createReq() {
    this._router.navigate(['axis/finance-manager/requisitions/asset/create']);
  }

  viewReqVehilce(id: string) {
    this._router.navigateByUrl(`axis/finance-manager/requisitions/asset/${id}`)
  }
  setStatus(value) {
    this.status = value;
    console.log(this.status == "employee" ? false :true);
    this.getAssetReqs();
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this requisition ?",
      title: "Delete Requisition Confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleVehicelReq(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Department delete canceled')
      }
    });
  }

  deteleVehicelReq(id: string) {
    this.isLoading = true;
    this._assetRequisitionService.deleteAssetRequisition(id).subscribe(response => {
      this._alertService.displayMessage('Requisition Deleted');
      this.getAssetReqs();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Try again')
    })
  }
}