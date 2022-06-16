import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
// import { Card } from '../../models/cards/card.types';
import { User } from '../../models/users/users.types';
import { CardService } from '../../services/cards/card.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss']
})
export class CreateCardComponent implements OnInit {

  cardCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  card: any;
  users: User[]

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateCardComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _cardService: CardService,
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
    this.cardCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      id: [''],
      cardNumber: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      currency: ['', [Validators.required]]
    });
    if (this.data.isEdit) {
      this.getCard();
    }
  }

  getCard() {
    this._cardService.getCard(this.data.id).subscribe((card: any) => {
      this.card = card;
      this.cardCreateForm.patchValue({
        description: this.card.description,
        status: this.card.status,
        id: this.card.id,
        cardNumber: this.card.cardNumber,
        amount: this.card.amount,
        currency: this.card.currency,
      })
    }, error => {
      this._alertService.displayError('Could not fetch card')
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

    if (this.cardCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.cardCreateForm.disable();

    this.showAlert = false;

    this._cardService.saveCard(this.cardCreateForm.value).subscribe((response) => {
      console.log(response);
      this.cardCreateForm.enable()
      this._alertService.displayMessage('Card Created');
      this.matDialogRef.close();
    }, error => {
      this.cardCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.cardCreateForm.disable();

    this.showAlert = false;

    this._cardService.updateCard(this.data.id, this.cardCreateForm.value).subscribe((response) => {
      console.log(response);
      this.cardCreateForm.enable()
      this._alertService.displayMessage('Card Updated');
      this.matDialogRef.close();
    }, error => {
      this.cardCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

}
