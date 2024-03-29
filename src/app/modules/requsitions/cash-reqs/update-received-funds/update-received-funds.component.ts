import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service'
import { CreateDepartmentComponent } from 'app/modules/admin/departments/create-department/create-department.component';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';

@Component({
  selector: 'app-update-received-funds',
  templateUrl: './update-received-funds.component.html',
  styleUrls: ['./update-received-funds.component.scss']
})
export class UpdateReceivedFundsComponent implements OnInit {


  updateCashReleasedForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateDepartmentComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _cashRequisitionService: CashRequisitionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.updateCashReleasedForm = this._formBuilder.group({
      receivedFunds: [0, [Validators.required]],
      id: [this.data.cashReq.id.toString()],
      status: ['Cash received'],
    });
  }

  saveAndClose(): void {
    this.matDialogRef.close();
  }


  save(): void {
    this.updateCashReleasedForm.disable();

    this.showAlert = false;

    this._cashRequisitionService.updateReceivedFunds(this.updateCashReleasedForm.value).subscribe((response) => {
      console.log(response);
      this.updateCashReleasedForm.enable()
      this._alertService.displayMessage('Funds Updated');
      this.matDialogRef.close();
    }, error => {
      this.updateCashReleasedForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }



}
