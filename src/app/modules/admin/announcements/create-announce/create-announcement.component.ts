import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { User } from '../../models/users/users.types';
import { DepartmentService } from '../../services/departments/department.service';

@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss']
})
export class CreateAnnouncementComponent implements OnInit {

  announcementCreateForm: FormGroup;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  announcement: any;
  users: User[]

  /**
   * Constructor
   */
  constructor(
    public matDialogRef: MatDialogRef<CreateAnnouncementComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _announcementService: DepartmentService,
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
    this.announcementCreateForm = this._formBuilder.group({
      description: ['', [Validators.required]],
      title: ['', [Validators.required]],
      status: ['Created'],
      id: [''],
      announcementHeading: ['',[Validators.required]],
      announcingEmployeeId: [this._userService.getLocalUser().id],
    });
    if (this.data.isEdit) {
      this.getAnnouncement();
    }
  }


  getAnnouncement() {
    this._announcementService.getAnnouncement(this.data.id).subscribe((announcement: any) => {
      this.announcement = announcement;
      this.announcementCreateForm.patchValue({
        description: this.announcement.description,
        title: this.announcement.title,
        status: this.announcement.status,
        id: this.announcement.id,
        announcementHeading: this.announcement.announcementHeading,
        announcingEmployeeId: this.announcement.announcingEmployeeId,
      })
    }, error => {
      this._alertService.displayError('Could not fetch announcement')
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

    if (this.announcementCreateForm.invalid) {
      return;
    }
    // Hide the alert

    this.announcementCreateForm.disable();

    this.showAlert = false;

    this._announcementService.saveAnnouncement(this.announcementCreateForm.value).subscribe((response) => {
      console.log(response);
      this.announcementCreateForm.enable()
      this._alertService.displayMessage('Announcement Created');
      this.matDialogRef.close();
    }, error => {
      this.announcementCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

  update(): void {
    this.announcementCreateForm.disable();

    this.showAlert = false;

    this._announcementService.updateAnnouncement(this.data.id, this.announcementCreateForm.value).subscribe((response) => {
      console.log(response);
      this.announcementCreateForm.enable()
      this._alertService.displayMessage('Announcement Updated');
      this.matDialogRef.close();
    }, error => {
      this.announcementCreateForm.enable()
      this.alert.message = "Something went wrong try again"
      this.showAlert = true;
      this._alertService.displayError(this.alert.message);
      console.log(error);
    })
  }

}
