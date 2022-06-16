import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
// import { Asset } from '../../models/assets/asset.types';
import { User } from '../../models/users/users.types';
import { AssetService } from '../../services/assets/asset.service';

@Component({
  selector: 'app-create-asset',
  templateUrl: './create-asset.component.html',
  styleUrls: ['./create-asset.component.scss']
})
export class CreateAssetComponent implements OnInit {

  assetCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  asset: any;
  users: User[]

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateAssetComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _assetService: AssetService,
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
    this.assetCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id: [''],
      serialNumber: ['', [Validators.required]],
      assetCode: ['', [Validators.required]],
    });
    if (this.data.isEdit) {
      this.getAsset();
    }
  }

  getAsset() {
    this._assetService.getAsset(this.data.id).subscribe((asset: any) => {
      this.asset = asset;
      this.assetCreateForm.patchValue({
        description: this.asset.description,
        status: this.asset.status,
        id: this.asset.id,
        serialNumber: this.asset.serialNumber,
        assetCode: this.asset.assetCode,
      })
    }, error => {
      this._alertService.displayError('Could not fetch asset')
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

    if (this.assetCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.assetCreateForm.disable();

    this.showAlert = false;

    this._assetService.saveAsset(this.assetCreateForm.value).subscribe((response) => {
      console.log(response);
      this.assetCreateForm.enable()
      this._alertService.displayMessage('Asset Created');
      this.matDialogRef.close();
    }, error => {
      this.assetCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.assetCreateForm.disable();

    this.showAlert = false;

    this._assetService.updateAsset(this.data.id, this.assetCreateForm.value).subscribe((response) => {
      console.log(response);
      this.assetCreateForm.enable()
      this._alertService.displayMessage('Asset Updated');
      this.matDialogRef.close();
    }, error => {
      this.assetCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

}
