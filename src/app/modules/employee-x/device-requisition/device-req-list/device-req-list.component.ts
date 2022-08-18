import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Subject } from 'rxjs';
import { DeviceRequisitionService } from '../../services/device-requisitions/device-requisitions.service';

@Component({
  selector: 'app-device-req-list',
  templateUrl: './device-req-list.component.html',
  styleUrls: ['./device-req-list.component.scss']
})
export class DeviceReqListComponent implements OnInit {

  deviceRequisitions: any[];
  deviceReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
  deviceReqTableColumns: string[] = ["title", "status", "duration", 'startDate',"device" ,"endDate", "action"];
  isLoading: boolean = true;


  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _deviceRequisitionService: DeviceRequisitionService,
    private _alertService: AlertService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
  }


  ngOnInit(): void {
    this.getDeviceReqs()
  }

  getDeviceReqs() {
    this.isLoading = true;
    this._deviceRequisitionService.getAllDeviceRequisitions().subscribe(response => {
      this.deviceReqDataSource.data = response;
      console.log(this.deviceReqDataSource.data);
      this.isLoading = false
    }, error => {
      console.log(error);
      this._alertService.displayError("Could not fetch device requisitions reload!")
      this.isLoading = false
    })
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  createReq() {
    this._router.navigate(['axis/employee/requisitions/device/create']);
  }

  viewReqVehilce(id: string) {
    this._router.navigateByUrl(`axis/employee/requisitions/device/${id}`)
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
    this._deviceRequisitionService.deleteVehicelRequisition(id).subscribe(response => {
      this._alertService.displayMessage('Requisition Deleted');
      this.getDeviceReqs();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
    })
  }
}
