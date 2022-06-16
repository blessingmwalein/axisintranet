import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
// import { Vehicle } from '../../models/vehicles/vehicle.types';
import { User } from '../../models/users/users.types';
import { VehicleService } from '../../services/vehicles/vehicle.service';

@Component({
  selector: 'app-create-vehicle',
  templateUrl: './create-vehicle.component.html',
  styleUrls: ['./create-vehicle.component.scss']
})
export class CreateVehicleComponent implements OnInit {

  vehicleCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  formFieldHelpers: string[] = [''];
  showAlert: boolean = false;
  vehicle: any;
  users: User[]
  maxDate = new Date();
  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateVehicleComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _vehicleService: VehicleService,
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
    this.vehicleCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id: [''],
      regNumber: ['', [Validators.required]],
      lastServiceDate: ['', [Validators.required]],
    });
    if (this.data.isEdit) {
      this.getVehicle();
    }
  }

  getVehicle() {
    this._vehicleService.getVehicle(this.data.id).subscribe((vehicle: any) => {
      this.vehicle = vehicle;
      this.vehicleCreateForm.patchValue({
        description: this.vehicle.description,
        status: this.vehicle.status,
        id: this.vehicle.id,
        regNumber: this.vehicle.regNumber,
        lastServiceDate: this.vehicle.lastServiceDate,
      })
    }, error => {
      this._alertService.displayError('Could not fetch vehicle')
    })
  }
  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
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

    if (this.vehicleCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.vehicleCreateForm.disable();

    this.showAlert = false;

    this._vehicleService.saveVehicle(this.vehicleCreateForm.value).subscribe((response) => {
      console.log(response);
      this.vehicleCreateForm.enable()
      this._alertService.displayMessage('Vehicle Created');
      this.matDialogRef.close();
    }, error => {
      this.vehicleCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.vehicleCreateForm.disable();

    this.showAlert = false;

    this._vehicleService.updateVehicle(this.data.id, this.vehicleCreateForm.value).subscribe((response) => {
      console.log(response);
      this.vehicleCreateForm.enable()
      this._alertService.displayMessage('Vehicle Updated');
      this.matDialogRef.close();
    }, error => {
      this.vehicleCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }
}
