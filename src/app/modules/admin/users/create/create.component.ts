import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Role } from '../../models/users/role.types';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  createUserForm: FormGroup;
  formFieldHelpers: string[] = [''];
  selectedRoles: string[] = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('rolesPanel') private _rolesPanel: TemplateRef<any>;
  @ViewChild('rolesPanelOrigin') private _rolesPanelOrigin: ElementRef;
  private _rolesPanelOverlayRef: OverlayRef;

  roles: Role[];
  rolesEditMode: boolean = false;
  filteredRoles: Role[];

  constructor(
    public matDialogRef: MatDialogRef<CreateComponent>,
    private _overlay: Overlay,
    private _fuseConfirmationService: FuseConfirmationService,
    private _renderer2: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef, private _formBuilder: FormBuilder, private _router: Router, private alert: AlertService, private _userService: UserService) { }

  ngOnInit(): void {
    this.createUserForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmationPassword: [''],
      lineApprover: ['Philip'],
      roles: [[]]
    });

    this.getRoles();

  }

  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();

    // Dispose the overlays if they are still on the DOM
    if (this._rolesPanelOverlayRef) {
      this._rolesPanelOverlayRef.dispose();
    }
  }


  getRoles() {
    this._userService.getAllRoles().subscribe((roles: Role[]) => {
      this.roles = roles;
      this.filteredRoles = roles;
    }, error => {
      console.log(error);
      this.alert.displayError('Failed to fetch roles')
    })
  }

  closeDialog(){
    this.matDialogRef.close();
  }

  saveUser() {

    
    if(this.createUserForm.invalid){
      return;
    }
    this.createUserForm.patchValue({
      confirmationPassword : this.createUserForm.value.password
    })

    this.createUserForm.disable();
    this._userService.createUser(this.createUserForm.value).subscribe(response => {
      this.alert.displayMessage('User created')
      this.createUserForm.enable();
      this.matDialogRef.close();
    }, error => {
      console.log(error);
      this.alert.displayError('Error while creating user try again');
      this.createUserForm.enable();

    })
  }

  //roles

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
    this.createUserForm.get('roles').patchValue(this.selectedRoles);

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
    this.createUserForm.get('roles').patchValue(this.selectedRoles);

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
