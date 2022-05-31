import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Subject } from 'rxjs';
import { VehicleRequisitionService } from '../../services/vehicle-requisitions/vehicle-requisitions.service';

@Component({
  selector: 'app-vehicle-req-list',
  templateUrl: './vehicle-req-list.component.html',
  styleUrls: ['./vehicle-req-list.component.scss']
})
export class VehicleReqListComponent implements OnInit {

  vehicleRequisitions: any[];
  vehicleReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
  vehicleReqTableColumns: string[] = ["title", "status", "duration", 'startDate', "endDate", "action"];
  isLoading: boolean = true;


  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _vehicleRequisitionService: VehicleRequisitionService,
    private _alertService: AlertService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
  }


  ngOnInit(): void {
    this.getVehicleReqs()
  }

  getVehicleReqs() {
    this.isLoading = true;
    this._vehicleRequisitionService.getAllVehicleRequisitions().subscribe(response => {
      this.vehicleReqDataSource.data = response;
      console.log(this.vehicleReqDataSource.data);
      this.isLoading = false
    }, error => {
      console.log(error);
      this._alertService.displayError("Could not fetch vehicle requisitions reload!")
      this.isLoading = false
    })
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  createReq() {
    this._router.navigate(['axis/employee/requisitions/vehicle/create']);
  }

  viewReqVehilce(id: string) {
    this._router.navigateByUrl(`axis/employee/requisitions/vehicle/${id}`)
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
    this._vehicleRequisitionService.deleteVehicelRequisition(id).subscribe(response => {
      this._alertService.displayMessage('Requisition Deleted');
      this.getVehicleReqs();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Try again')
    })
  }
}
