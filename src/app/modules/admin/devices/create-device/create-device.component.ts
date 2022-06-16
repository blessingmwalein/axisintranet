import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
// import { Device } from '../../models/devices/device.types';
import { User } from '../../models/users/users.types';
import { DeviceService } from '../../services/devices/device.service';

@Component({
  selector: 'app-create-device',
  templateUrl: './create-device.component.html',
  styleUrls: ['./create-device.component.scss']
})
export class CreateDeviceComponent implements OnInit {

  deviceCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  device: any;
  users: User[]

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateDeviceComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _deviceService: DeviceService,
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
    this.deviceCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id: [''],
      serialNumber: ['',[Validators.required]],
      itemCode: ['',[Validators.required]],
    });
    if (this.data.isEdit) {
      this.getDevice();
    }
  }

  getDevice() {
    this._deviceService.getDevice(this.data.id).subscribe((device: any) => {
      this.device = device;
      this.deviceCreateForm.patchValue({
        description: this.device.description,
        status: this.device.status,
        id: this.device.id,
        serialNumber: this.device.serialNumber,
        itemCode: this.device.itemCode,
      })
    }, error => {
      this._alertService.displayError('Could not fetch device')
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

    if (this.deviceCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.deviceCreateForm.disable();

    this.showAlert = false;

    this._deviceService.saveDevice(this.deviceCreateForm.value).subscribe((response) => {
      console.log(response);
      this.deviceCreateForm.enable()
      this._alertService.displayMessage('Device Created');
      this.matDialogRef.close();
    }, error => {
      this.deviceCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.deviceCreateForm.disable();

    this.showAlert = false;

    this._deviceService.updateDevice(this.data.id, this.deviceCreateForm.value).subscribe((response) => {
      console.log(response);
      this.deviceCreateForm.enable()
      this._alertService.displayMessage('Device Updated');
      this.matDialogRef.close();
    }, error => {
      this.deviceCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

}
