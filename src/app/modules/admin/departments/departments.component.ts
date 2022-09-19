import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Department } from '../models/departments/department.types';
import { DepartmentService } from '../services/departments/department.service';
import { CreateDepartmentComponent } from './create-department/create-department.component';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

  @ViewChild('departmentsTable', { read: MatSort }) departmentsTableSort: MatSort;


  departmentsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  departmentsTableColumns: string[] = ["description", "name", "approverName", "status", "action"];

  isLoading: boolean = true;
  departments: Department[];

  constructor(private _userService: UserService, private _departmentService: DepartmentService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this._departmentService.getDepartments().subscribe((departments: any) => {
      this.departmentsDataSource.data = departments;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.departmentsDataSource.sort = this.departmentsTableSort;
  }

  openCreateDepartmentDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateDepartmentComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getDepartments();
      });
  }

  openEditDepartmentDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateDepartmentComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getDepartments();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this department ?",
      title: "Delete department confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleDepartment(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Department delete canceled')
      }
    });
  }

  deteleDepartment(id: string) {
    this.isLoading = true;
    this._departmentService.deleteDepartment(id).subscribe(response => {
      this._alertService.displayMessage('Department Deleted');
      this.getDepartments();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
    })
  }

}
