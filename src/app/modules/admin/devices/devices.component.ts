import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { DeviceService } from '../services/devices/device.service';
// import { Device } from '../models/devices/device.types';
import { CreateDeviceComponent } from './create-device/create-device.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  @ViewChild('devicesTable', { read: MatSort }) devicesTableSort: MatSort;


  devicesDataSource: MatTableDataSource<any> = new MatTableDataSource();
  devicesTableColumns: string[] = ["description", "serialNumber", "itemCode", "status", "action"];

  isLoading: boolean = true;
  devices: any[];

  constructor(private _userService: UserService, private _deviceService: DeviceService, private _alertService: AlertService, private _matDialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService) { }

  ngOnInit() {
    this.getDevices();
  }

  getDevices() {
    this._deviceService.getDevices().subscribe((devices: any) => {
      this.devicesDataSource.data = devices;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    })
  }

  ngAfterViewInit(): void {
    // Make the data source sortable
    this.devicesDataSource.sort = this.devicesTableSort;
  }

  openCreateDeviceDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateDeviceComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getDevices();
      });
  }

  openEditDeviceDialog(id: string): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateDeviceComponent, {
      data: { isEdit: true, id: id },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        this.getDevices();
      });
  }

  openDeleteDialog(id: string) {
    const dialogRef = this._fuseConfirmationService.open({
      message: "Are sure you want to delete this item ?",
      title: "Delete Device Confirmation"
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == 'confirmed') {
        this.deteleDevice(id)
      }
      if (result == 'cancelled' || result == undefined) {
        this._alertService.displayError('Device delete canceled')
      }
    });
  }

  deteleDevice(id: string) {
    this.isLoading = true;
    this._deviceService.deleteDevice(id).subscribe(response => {
      this._alertService.displayMessage('Device Deleted');
      this.getDevices();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Try again')
    })
  }

}
