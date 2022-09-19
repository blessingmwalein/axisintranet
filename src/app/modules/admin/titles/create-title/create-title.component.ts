import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Title } from '../../models/titles/title.types';
import { User } from '../../models/users/users.types';
import { TitleService } from '../../services/titles/title.service';

@Component({
    selector: 'app-create-title',
    templateUrl: './create-title.component.html',
    styleUrls: ['./create-title.component.scss'],
})
export class CreateTitleComponent implements OnInit {
    titleCreateForm: FormGroup;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;
    title: any;
    users: User[];

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<CreateTitleComponent>,
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _alertService: AlertService,
        private _titleService: TitleService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.getUsers();
        this.titleCreateForm = this._formBuilder.group({
            description: ['', [Validators.required]],
            name: ['', [Validators.required]],
            status: ['', [Validators.required]],
            id: [''],
        });
        if (this.data.isEdit) {
            this.getTitle();
        }
    }

    getTitle() {
        this._titleService.getTitle(this.data.id).subscribe(
            (title: any) => {
                this.title = title;
                this.titleCreateForm.patchValue({
                    description: this.title.description,
                    name: this.title.name,
                    status: this.title.status,
                    id: this.title.id,
                });
            },
            (error) => {
                this._alertService.displayError('Could not fetch title');
            }
        );
    }

    getUsers() {
        this._userService.getAllUsers().subscribe(
            (users) => {
                this.users = users;
            },
            (error) => {
                this._alertService.displayError('Failed to fetch users');
            }
        );
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
        if (this.titleCreateForm.invalid) {
            return;
        }
        // Hide the alert

        this.titleCreateForm.disable();

        this.showAlert = false;

        this._titleService.saveTitle(this.titleCreateForm.value).subscribe(
            (response) => {
                console.log(response);
                this.titleCreateForm.enable();
                this._alertService.displayMessage('Title Created');
                this.matDialogRef.close();
            },
            (error) => {
                this.titleCreateForm.enable();
                this.alert.message = 'Something went wrong try again';
                this.showAlert = true;
                this._alertService.displayError(this.alert.message);
                console.log(error);
            }
        );
    }

    update(): void {
        this.titleCreateForm.disable();

        this.showAlert = false;

        this._titleService
            .updateTitle(this.data.id, this.titleCreateForm.value)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.titleCreateForm.enable();
                    this._alertService.displayMessage('Title Updated');
                    this.matDialogRef.close();
                },
                (error) => {
                    this.titleCreateForm.enable();
                    this.alert.message = 'Something went wrong try again';
                    this.showAlert = true;
                    this._alertService.displayError(this.alert.message);
                    console.log(error);
                }
            );
    }
}
