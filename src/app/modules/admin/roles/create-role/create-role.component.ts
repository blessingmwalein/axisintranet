import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Role } from '../../models/users/role.types';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  roleCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  role: Role;

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateRoleComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
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
    this.roleCreateForm = this._formBuilder.group({
      roleName: ['', [Validators.required]],
      id: ['']
    });
    if (this.data.isEdit) {
      this.getRole();
    }
  }

  getRole() {
    this._userService.getRole(this.data.id).subscribe(role => {
      this.role = role;
      this.roleCreateForm.patchValue({
        roleName: this.role.roleName,
        id: this.data.id
      })
    }, error => {
      this._alertService.displayError('Could not fetch role')
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

    if (this.roleCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.roleCreateForm.disable();

    this.showAlert = false;

    this._userService.saveRole(this.roleCreateForm.value).subscribe((response) => {
      console.log(response);
      this.roleCreateForm.enable()
      this._alertService.displayMessage('Role Created');
      this.matDialogRef.close();
    }, error => {
      this.roleCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.roleCreateForm.disable();

    this.showAlert = false;

    this._userService.updateRole(this.data.id, this.roleCreateForm.value).subscribe((response) => {
      console.log(response);
      this.roleCreateForm.enable()
      this._alertService.displayMessage('Role Updated');
      this.matDialogRef.close();
    }, error => {
      this.roleCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

}
