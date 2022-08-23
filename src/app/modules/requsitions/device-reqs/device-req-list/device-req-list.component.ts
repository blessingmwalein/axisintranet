import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { DeviceRequisitionService } from 'app/modules/employee-x/services/device-requisitions/device-requisitions.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-device-req-list',
    templateUrl: './device-req-list.component.html',
    styleUrls: ['./device-req-list.component.scss'],
})
export class DeviceReqListComponent implements OnInit {
    deviceRequisitions: any[];
    deviceReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
    deviceReqTableColumns: string[] = [
        'title',
        'status',
        'duration',
        'startDate',
        'device',
        'endDate',
        'action',
    ];
    isLoading: boolean = true;
    user: User;
    status = 'employee';
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _deviceRequisitionService: DeviceRequisitionService,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
        console.log(this.user);
        this.getReqByRole();
    }

    getDeviceReqs() {
        this.isLoading = true;
        this._deviceRequisitionService.getAllDeviceRequisitions().subscribe(
            (response) => {
                this.deviceReqDataSource.data = response;
                console.log(this.deviceReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch device requisitions reload!'
                );
                this.isLoading = false;
            }
        );
    }

    getFilteredCashReq() {
        this.isLoading = true;
        this._deviceRequisitionService
            .getFilteredDeviceRequisitionsLogged(
                this.status == 'employee' ? false : true
            )
            .subscribe(
                (response) => {
                    this.deviceReqDataSource.data = response;
                    console.log(this.deviceReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch device requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }

    getReqByRole() {
        if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
            this.getFilteredCashReq();
        } else if (this.user.roles[0].toUpperCase() == 'EMPLOYEE') {
            this.getDeviceReqs();
        } else if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getloggedCardReqs();
        }
    }
    getDeviceReqsByStatus() {
        this.isLoading = true;
        this._deviceRequisitionService
            .getDeviceRequsitionByStatus(this.status)
            .subscribe(
                (response) => {
                    this.deviceReqDataSource.data = response;
                    console.log(this.deviceReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch device requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }
    getloggedCardReqs() {
        this.isLoading = true;
        this._deviceRequisitionService
            .getAllDeviceRequisitionsLogged()
            .subscribe(
                (response) => {
                    this.deviceReqDataSource.data = response;
                    console.log(this.deviceReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch device requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }
    setStatus(value) {
        this.status = value;
        if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getDeviceReqsByStatus();
        } else {
            this.getReqByRole();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    createReq() {
        this._router.navigate(['axis/requsitions/device/create']);
    }

    viewReqVehilce(id: string) {
        this._router.navigateByUrl(`axis/requsitions/device/${id}`);
    }

    openDeleteDialog(id: string) {
        const dialogRef = this._fuseConfirmationService.open({
            message: 'Are sure you want to delete this requisition ?',
            title: 'Delete Requisition Confirmation',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                this.deteleVehicelReq(id);
            }
        });
    }

    deteleVehicelReq(id: string) {
        this.isLoading = true;
        this._deviceRequisitionService.deleteVehicelRequisition(id).subscribe(
            (response) => {
                this._alertService.displayMessage('Requisition Deleted');
                this.getDeviceReqs();
                this.isLoading = false;
            },
            (error) => {
                this.isLoading = false;
                this._alertService.displayError(
                    `Something went wrong:  ${error?.error?.message}`
                );
            }
        );
    }
}
