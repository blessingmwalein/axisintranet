import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
// import { Cash } from '../../models/cashs/cash.types';
import { User } from '../../models/users/users.types';
import { CashService } from '../../services/cashs/cash.service';

@Component({
  selector: 'app-create-cash',
  templateUrl: './create-cash.component.html',
  styleUrls: ['./create-cash.component.scss']
})
export class CreateCashComponent implements OnInit {

  cashCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  cash: any;
  users: User[]

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateCashComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _cashService: CashService,
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
    this.cashCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id: [''],
      currencyCode: ['',[Validators.required]],
      amount: ['',[Validators.required]],
      currency :['',[Validators.required]],
      
    });
    if (this.data.isEdit) {
      this.getCash();
    }
  }

  getCash() {
    this._cashService.getCash(this.data.id).subscribe((cash: any) => {
      this.cash = cash;
      this.cashCreateForm.patchValue({
        description: this.cash.description,
        status: this.cash.status,
        id: this.cash.id,
        currencyCode: this.cash.currencyCode,
        amount: this.cash.amount,
        currency: this.cash.currency,
      })
    }, error => {
      this._alertService.displayError('Could not fetch cash')
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

    if (this.cashCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.cashCreateForm.disable();

    this.showAlert = false;

    this._cashService.saveCash(this.cashCreateForm.value).subscribe((response) => {
      console.log(response);
      this.cashCreateForm.enable()
      this._alertService.displayMessage('Cash Created');
      this.matDialogRef.close();
    }, error => {
      this.cashCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.cashCreateForm.disable();

    this.showAlert = false;

    this._cashService.updateCash(this.data.id, this.cashCreateForm.value).subscribe((response) => {
      console.log(response);
      this.cashCreateForm.enable()
      this._alertService.displayMessage('Cash Updated');
      this.matDialogRef.close();
    }, error => {
      this.cashCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

}
