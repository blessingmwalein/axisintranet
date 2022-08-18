import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { Role } from '../models/users/role.types';
import { CreateRoleComponent } from './create-role/create-role.component';
import { FuseConfirmationModule, FuseConfirmationService } from '@fuse/services/confirmation';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @ViewChild('rolesTable', { read: MatSort }) rolesTableSort: MatSort;


  rolesDataSource: MatTableDataSource<any> = new MatTableDataSource();
  rolesTableColumns: string[] = ['name', "action"];

  isLoading: boolean = true;
  roles: Role[];

  constructor(private _userService: UserService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {

    this.getRoles();
  }

  getRoles() {
    this._userService.getAllRoles().subscribe((roles: Role[]) => {
      this.rolesDataSource.data = roles;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.rolesDataSource.sort = this.rolesTableSort;
  }

  openCreateRoleDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateRoleComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getRoles();
      });
  }

  openEditRoleDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateRoleComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getRoles();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this item ?",
      title: "Delete Role Confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleRole(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Role delete canceled')
      }
    });
  }

  deteleRole(id: string) {
    this.isLoading = true;
    this._userService.deleteRole(id).subscribe(response => {
      this._alertService.displayMessage('Role Deleted');
      this.getRoles();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
    })
  }
}
