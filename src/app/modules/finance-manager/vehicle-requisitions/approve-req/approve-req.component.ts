import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { Department } from 'app/modules/admin/models/users/users.types';
import { DepartmentService } from 'app/modules/admin/services/departments/department.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';

@Component({
  selector: 'app-approve-req',
  templateUrl: './approve-req.component.html',
  styleUrls: ['./approve-req.component.scss']
})
export class ApproveReqComponent implements OnInit {

  departmentCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  department: Department;

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<ApproveReqComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _departmentService :DepartmentService,
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
    // Create the form
    this.departmentCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id: ['']
    });

  }



  saveAndClose(): void {
    this.matDialogRef.close();
  }


  save(): void {

    
  }

 

}
