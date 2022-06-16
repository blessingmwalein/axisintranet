import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Department } from '../../models/departments/department.types';
import { User } from '../../models/users/users.types';
import { DepartmentService } from '../../services/departments/department.service';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent implements OnInit {

  departmentCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  department: any;
  users: User[]

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateDepartmentComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _departmentService: DepartmentService,
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
    this.getUsers();
    this.departmentCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id: [''],
      approverId: ['',[Validators.required]],
      approverName: [''],
      approverEmail: [''],
    });
    if (this.data.isEdit) {
      this.getDepartment();
    }
  }

  getDepartment() {
    this._departmentService.getDepartment(this.data.id).subscribe((department: any) => {
      this.department = department;
      this.departmentCreateForm.patchValue({
        description: this.department.description,
        name: this.department.name,
        status: this.department.status,
        id: this.department.id,
        approverId: this.department.approverId,
        approverName: this.department.approverName,
        approverEmail: this.department.approverEmail
      })
    }, error => {
      this._alertService.displayError('Could not fetch department')
    })
  }

  getUsers() {
    this._userService.getAllUsers().subscribe(users => {
      this.users = users
    }, error => {
      this._alertService.displayError("Failed to fetch users")
    })
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the copy field with the given field name
   *
   * @param name
   */

  saveAndClose(): void {
    this.matDialogRef.close();
  }


  save(): void {

    if (this.departmentCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.departmentCreateForm.disable();

    this.showAlert = false;

    this._departmentService.saveDepartment(this.departmentCreateForm.value).subscribe((response) => {
      console.log(response);
      this.departmentCreateForm.enable()
      this._alertService.displayMessage('Department Created');
      this.matDialogRef.close();
    }, error => {
      this.departmentCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.departmentCreateForm.disable();

    this.showAlert = false;

    this._departmentService.updateDepartment(this.data.id, this.departmentCreateForm.value).subscribe((response) => {
      console.log(response);
      this.departmentCreateForm.enable()
      this._alertService.displayMessage('Department Updated');
      this.matDialogRef.close();
    }, error => {
      this.departmentCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

}
