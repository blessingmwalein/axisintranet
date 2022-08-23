import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.resetPasswordForm = this._formBuilder.group(
            {
                newPassword: ['', Validators.required],
                confirmNewPassword: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                token: [''],
            },
            {
                validators: FuseValidators.mustMatch(
                    'newPassword',
                    'confirmNewPassword'
                ),
            }
        );
        this.activatedRoute.queryParams.subscribe((params) => {
            const token = params['query'];
            console.log(token);

            this.resetPasswordForm.patchValue({
                token: "AQAAAAEAACcQAAAAEJSMHcaXMFvXMD4KePstQYysPTDvH8zy/nav7FkmFMwfWE/9ifmKV2vxqZ4WJxsm0g==BPXU7G23GYRYB6YGEHPQ77ZZ2HABAKQ3",
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void {
        // Return if the form is invalid

        console.log(this.resetPasswordForm.invalid);

        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this._authService
            .resetPassword(this.resetPasswordForm.value)

            .subscribe(
                (response) => {
                    console.log(response);

                    this.alert = {
                        type: 'success',
                        message: response.message,
                    };
                    this.showAlert = true;
                    this.resetPasswordForm.enable();
                    this.resetPasswordNgForm.resetForm();
                },
                (error) => {
                    // Set the alert
                    console.log(error);

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: error?.error?.message,
                    };
                    // Show the alert
                    this.showAlert = true;
                }
            );
    }
}
