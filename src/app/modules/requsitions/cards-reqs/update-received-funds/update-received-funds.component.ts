import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service'
import { CreateDepartmentComponent } from 'app/modules/admin/departments/create-department/create-department.component';
import { User } from 'app/modules/admin/models/users/users.types';
import { DepartmentService } from 'app/modules/admin/services/departments/department.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';

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
    private _cardRequisitionService: CardRequisitionService,
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
      id: [this.data.cardReq.id.toString()],
      status: ['Cash received'],
    });
  }

  saveAndClose(): void {
    this.matDialogRef.close();
  }


  save(): void {
    this.updateCashReleasedForm.disable();

    this.showAlert = false;

    this._cardRequisitionService.updateReceivedFunds(this.updateCashReleasedForm.value).subscribe((response) => {
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
