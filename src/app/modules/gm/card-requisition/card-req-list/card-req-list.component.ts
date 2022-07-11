import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-card-req-list',
  templateUrl: './card-req-list.component.html',
  styleUrls: ['./card-req-list.component.scss']
})
export class CardReqListComponent implements OnInit {

  cardRequisitions: any[];
  cardReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
  cardReqTableColumns: string[] = ["title", "status", "duration", 'startDate', "endDate", "amount", "action"];
  isLoading: boolean = true;
  status = "Created"
  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _cardRequisitionService: CardRequisitionService,
    private _alertService: AlertService,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
  }


  ngOnInit(): void {
    this.getCardReqs()
  }

  getCardReqs() {
    this.isLoading = true;
    this._cardRequisitionService.getAllCardRequisitionsLogged().subscribe(response => {
      this.cardReqDataSource.data = response;
      console.log(this.cardReqDataSource.data);
      this.isLoading = false
    }, error => {
      console.log(error);
      this._alertService.displayError("Could not fetch card requisitions reload!")
      this.isLoading = false
    })
  }
  getCardReqsByStatus() {
    this.isLoading = true;
    this._cardRequisitionService.getCardRequsitionByStatus(this.status).subscribe(response => {
      this.cardReqDataSource.data = response;
      console.log(this.cardReqDataSource.data);
      this.isLoading = false
    }, error => {
      console.log(error);
      this._alertService.displayError("Could not fetch card requisitions reload!")
      this.isLoading = false
    })
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  createReq() {
    this._router.navigate(['axis/g-m/requisitions/card/create']);
  }

  viewReqVehilce(id: string) {
    this._router.navigateByUrl(`axis/g-m/requisitions/card/${id}`)
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
    this._cardRequisitionService.deleteVehicelRequisition(id).subscribe(response => {
      this._alertService.displayMessage('Requisition Deleted');
      this.getCardReqs();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Try again')
    })
  }

  setStatus(value) {
    this.status = value;
    this.getCardReqsByStatus();
  }
}
