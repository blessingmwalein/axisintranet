import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Announcement } from 'app/modules/employee-x/models/announcements/announcements.types';
import { DepartmentService } from '../services/departments/department.service';
import { CreateAnnouncementComponent } from './create-announce/create-announcement.component';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {

  @ViewChild('announcementsTable', { read: MatSort }) announcementsTableSort: MatSort;


  announcementsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  announcementsTableColumns: string[] = ["title", "announcementHeading","status", "action"];

  isLoading: boolean = true;
  announcements: Announcement[];

  constructor(private _userService: UserService, private _announcementService: DepartmentService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.getAnnouncements();
  }

  getAnnouncements() {
    this._announcementService.getAnnouncements().subscribe((announcements: any) => {
      this.announcementsDataSource.data = announcements;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.announcementsDataSource.sort = this.announcementsTableSort;
  }

  openCreateAnnouncementDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateAnnouncementComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getAnnouncements();
      });
  }

  openEditAnnouncementDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateAnnouncementComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getAnnouncements();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this announcement ?",
      title: "Delete announcement confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleAnnouncement(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Announcement delete canceled')
      }
    });
  }

  deteleAnnouncement(id: string) {
    this.isLoading = true;
    this._announcementService.deleteAnnouncement(id).subscribe(response => {
      this._alertService.displayMessage('Announcement Deleted');
      this.getAnnouncements();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
    })
  }
}
