import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Department, Tag, User } from '../../models/users/users.types';
import { UsersService } from '../../services/users/users.service';
import { UsersListComponent } from '../list/list.component';
import { UserService } from 'app/core/user/user.service';
import { Role } from '../../models/users/role.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { DepartmentService } from '../../services/departments/department.service';

@Component({
    selector: 'users-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    user: User;
    editUserForm: FormGroup;
    users: User[];
    departments: Department[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    loading: boolean = true;
    /**
     * Constructor
     */

    selectedRoles: string[] = [];
    @ViewChild('rolesPanel') private _rolesPanel: TemplateRef<any>;
    @ViewChild('rolesPanelOrigin') private _rolesPanelOrigin: ElementRef;
    private _rolesPanelOverlayRef: OverlayRef;

    roles: Role[];
    rolesEditMode: boolean = false;
    filteredRoles: Role[];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _usersListComponent: UsersListComponent,
        private _usersService: UsersService,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _alertService: AlertService,
        private _departmentService: DepartmentService,

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._usersListComponent.matDrawer.open();

        // Create the user form
        this.editUserForm = this._formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            userName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            lineApprover: ['Philip'],
            roles: [[]],
            id: [''],
            departmentId: ['']
        });

        this.getDepartments();
        // Get the users
        this._usersService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users: User[]) => {
                this.users = users;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the user
        this._userService.get(this._activatedRoute.snapshot.params['id']).subscribe((user: any) => {
            console.log(user);
            this.user = user
            console.log(this.loading);

            this._userService.getAllRoles().subscribe((roles: Role[]) => {
                this.roles = roles
                this.selectedRoles = this.user.roles;
                this.filteredRoles = roles;

                this.editUserForm.patchValue({
                    id: this.user.id,
                    firstName: this.user.firstName,
                    lastName: this.user.lastName,
                    email: this.user.email,
                    userName: this.user.userName,
                    roles: this.user.roles,
                    departmentId: this.user.departmentsId,
                    lineApprover: this.user.lineApprover
                })
                this.loading = false;
            })
        }, error => {
            this.loading = false
        });

    }
    getDepartments() {
        this._departmentService.getDepartments().subscribe((departments: any) => {
            this.departments = departments;
        }, error => {
            console.log(error);
            this._alertService.displayError('Failed to fetch departments')
        })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._usersListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the user
     */
    updateUser(): void {
        // Get the user object
        const user = this.editUserForm.getRawValue();
        // Update the user on the server

        this._userService.editUserProfile(user.id, user).subscribe(() => {
            this._alertService.displayMessage(`User ${this.user.userName} updated`)
            this._userService.assignUserRoles({ userName: this.user.userName, roles: user.roles }).subscribe(response => {
                this._alertService.displayMessage(`User ${this.user.userName} roles updated`)
            }, error => {
                this._alertService.displayError("Failed to update user roles try again")
            })
        }, error => {
            this._alertService.displayError("Failed to update user try again")
        });
    }

    /**
     * Delete the user
     */
    deleteUser(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete user',
            message: 'Are you sure you want to delete this user? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current user's id
                const id = this.user.id;
                this._userService.deleteUser(id).subscribe(response => {
                    this._alertService.displayMessage(`User ${this.user.userName} deleted`);
                    this._router.navigate(['../'], { relativeTo: this._activatedRoute });

                }, error => {
                    console.log(error);
                    this._alertService.displayError(`Failed to delete user  ${this.user.userName} try again`);
                })
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        // Upload the avatar
        this._usersService.uploadAvatar(this.user.id, file).subscribe();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.editUserForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the user
        this.user.avatar = null;
    }


    trackByFn(index: number, item: any): any {
        return item.id || index;
    }


    openRolesPanel(): void {
        // Create the overlay
        this._rolesPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._rolesPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ])
        });

        // Subscribe to the attachments observable
        this._rolesPanelOverlayRef.attachments().subscribe(() => {

            // Add a class to the origin
            this._renderer2.addClass(this._rolesPanelOrigin.nativeElement, 'panel-opened');

            // Focus to the search input once the overlay has been attached
            this._rolesPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._rolesPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._rolesPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._rolesPanelOverlayRef.backdropClick().subscribe(() => {

            // Remove the class from the origin
            this._renderer2.removeClass(this._rolesPanelOrigin.nativeElement, 'panel-opened');

            // If overlay exists and attached...
            if (this._rolesPanelOverlayRef && this._rolesPanelOverlayRef.hasAttached()) {
                // Detach it
                this._rolesPanelOverlayRef.detach();

                // Reset the role filter
                this.filteredRoles = this.roles;

                // Toggle the edit mode off
                this.rolesEditMode = false;
            }

            // If template portal exists and attached...
            if (templatePortal && templatePortal.isAttached) {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * Toggle the roles edit mode
     */
    toggleRolesEditMode(): void {
        this.rolesEditMode = !this.rolesEditMode;
    }

    /**
     * Filter roles
     *
     * @param event
     */
    filterRoles(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the roles
        this.filteredRoles = this.roles.filter(role => role.roleName.toLowerCase().includes(value));
    }

    /**
     * Filter roles input key down event
     *
     * @param event
     */
    filterRolesInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no role available...
        if (this.filteredRoles.length === 0) {
            // Create the role
            this.createRole(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a role...
        const role = this.filteredRoles[0];
        const isRoleApplied = this.selectedRoles.find(id => id === role.roleName);

        // If the found role is already applied to the contact...
        if (isRoleApplied) {
            // Remove the role from the contact
            this.removeRoleFromContact(role);
        }
        else {
            // Otherwise add the role to the contact
            this.addRoleToContact(role);
        }
    }

    /**
     * Create a new role
     *
     * @param roleName
     */
    createRole(roleName: string): void {
        const role = {
            roleName
        };

        // this.addRoleToContact(response);

    }

    /**
     * Update the role.roleName
     *
     * @param role
     * @param event
     */
    updateRoleName(role: Role, event): void {
        // Update the roleName on the role
        role.roleName = event.target.value;

        // Update the role on the server
        // this._contactsService.updateRole(role.id, role)
        //   .pipe(debounceTime(300))
        //   .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the role
     *
     * @param role
     */
    deleteRole(role: Role): void {
        // Delete the role from the server
        // this._contactsService.deleteRole(role.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add role to the contact
     *
     * @param role
     */
    addRoleToContact(role: Role): void {
        // Add the role
        this.selectedRoles.unshift(role.roleName);

        // Update the contact form
        this.editUserForm.get('roles').patchValue(this.selectedRoles);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove role from the contact
     *
     * @param role
     */
    removeRoleFromContact(role: Role): void {
        // Remove the role
        this.selectedRoles.splice(this.selectedRoles.findIndex(item => item === role.roleName), 1);

        // Update the contact form
        this.editUserForm.get('roles').patchValue(this.selectedRoles);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle contact role
     *
     * @param role
     */
    toggleContactRole(role: Role): void {

        if (this.selectedRoles.includes(role.roleName)) {
            this.removeRoleFromContact(role);
        }
        else {
            this.addRoleToContact(role);
        }

        console.log(this.selectedRoles);

    }

    /**
     * Should the create role button be visible
     *
     * @param inputValue
     */
    shouldShowCreateRoleButton(inputValue: string): boolean {
        return !!!(inputValue === '' || this.roles.findIndex(role => role.roleName.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

}
