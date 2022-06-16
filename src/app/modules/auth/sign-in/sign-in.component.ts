import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { Role } from 'app/modules/admin/models/users/role.types';
import { UsersService } from 'app/modules/admin/services/users/users.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _router: Router,) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                (user) => {
                    this._userService.getAllRoles().subscribe((roles: Role[]): void => {
                        console.log(user);
                        this._userService.setUser(user)
                        this._router.navigateByUrl(this.userRedirectCallBack(user.roles[0]));
                        // this._userService.get(data.id).subscribe((user: any) => {
                        //     console.log(user);
                        //     this._userService.setUser(user)
                        //     this._router.navigateByUrl(this.userRedirectCallBack(user.roles[0]));
                        // });
                    });
                },
                (error) => {
                    console.log(error);

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: error?.error?.ErrorMessage
                    };
                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    userRedirectCallBack(role: string): string {
        switch (role.toLowerCase()) {
            case "employee":
                return 'axis/employee/dashboard';
                break;
            case "administrator":
                return 'axis/admin/dashboard';
                break;
            case "line manager":
                return 'axis/manager/dashboard';
                break;
            case "finance manager":
                return 'axis/finance-manager/dashboard';
                break;
            default:
                return ''
                break;
        }
    }
}
