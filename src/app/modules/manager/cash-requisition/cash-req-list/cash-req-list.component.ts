import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Subject } from 'rxjs';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';

@Component({
  selector: 'app-cash-req-list',
  templateUrl: './cash-req-list.component.html',
  styleUrls: ['./cash-req-list.component.scss']
})
export class CashReqListComponent implements OnInit {

  cashRequisitions: any[];
  cashReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
  cashReqTableColumns: string[] = ["title", "status", "duration", 'startDate', "endDate", "amount", "action"];
  isLoading: boolean = true;
  status = "employee";


  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _cashRequisitionService: CashRequisitionService,
    private _alertService: AlertService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
  }


  ngOnInit(): void {
    this.getCashReqs()
  }

  getCashReqs() {
    this.isLoading = true;
    this._cashRequisitionService.getFilteredCashRequisitions(this.status == "employee" ? false :true).subscribe(response => {
      this.cashReqDataSource.data = response;
      console.log(this.cashReqDataSource.data);
      this.isLoading = false
    }, error => {
      console.log(error);
      this._alertService.displayError("Could not fetch cash requisitions reload!")
      this.isLoading = false
    })
  }
  setStatus(value) {
    this.status = value;
    console.log(this.status == "employee" ? false :true);
    this.getCashReqs();
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  createReq() {
    this._router.navigate(['axis/manager/requisitions/cash/create']);
  }

  viewReqVehilce(id: string) {
    this._router.navigateByUrl(`axis/manager/requisitions/cash/${id}`)
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
    this._cashRequisitionService.deleteVehicelRequisition(id).subscribe(response => {
      this._alertService.displayMessage('Requisition Deleted');
      this.getCashReqs();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
    })
  }
}
