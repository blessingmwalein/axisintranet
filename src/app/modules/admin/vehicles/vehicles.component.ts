import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { VehicleService } from '../services/vehicles/vehicle.service';
// import { Vehicle } from '../models/vehicles/vehicle.types';
import { CreateVehicleComponent } from './create-vehicle/create-vehicle.component';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  @ViewChild('vehiclesTable', { read: MatSort }) vehiclesTableSort: MatSort;


  vehiclesDataSource: MatTableDataSource<any> = new MatTableDataSource();
  vehiclesTableColumns: string[] = ["description", "regNumber", "lastServiceDate", "status", "action"];

  isLoading: boolean = true;
  vehicles: any[];

  constructor(private _userService: UserService, private _vehicleService: VehicleService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.getVehicles();
  }

  getVehicles() {
    this._vehicleService.getVehicles().subscribe((vehicles: any) => {
      this.vehiclesDataSource.data = vehicles;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.vehiclesDataSource.sort = this.vehiclesTableSort;
  }

  openCreateVehicleDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateVehicleComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getVehicles();
      });
  }

  openEditVehicleDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateVehicleComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getVehicles();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this item ?",
      title: "Delete Vehicle Confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleVehicle(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Vehicle delete canceled')
      }
    });
  }

  deteleVehicle(id: string) {
    this.isLoading = true;
    this._vehicleService.deleteVehicle(id).subscribe(response => {
      this._alertService.displayMessage('Vehicle Deleted');
      this.getVehicles();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
    })
  }

}
