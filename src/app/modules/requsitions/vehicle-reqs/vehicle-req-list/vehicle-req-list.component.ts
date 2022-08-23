import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { VehicleRequisitionService } from 'app/modules/employee-x/services/vehicle-requisitions/vehicle-requisitions.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-vehicle-req-list',
    templateUrl: './vehicle-req-list.component.html',
    styleUrls: ['./vehicle-req-list.component.scss'],
})
export class VehicleReqListComponent implements OnInit {
    vehicleRequisitions: any[];
    vehicleReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
    vehicleReqTableColumns: string[] = [
        'title',
        'status',
        'duration',
        'startDate',
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
        private _vehicleRequisitionService: VehicleRequisitionService,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
        console.log(this.user);
        this.getReqByRole();
    }

    getVehicleReqs() {
        this.isLoading = true;
        this._vehicleRequisitionService.getAllVehicleRequisitionsNotLogged().subscribe(
            (response) => {
                this.vehicleReqDataSource.data = response;
                console.log(this.vehicleReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch vehicle requisitions reload!'
                );
                this.isLoading = false;
            }
        );
    }

    getFilteredVehicleReq() {
        this.isLoading = true;
        this._vehicleRequisitionService
            .getFilteredVehicleRequisitionsNotLogged(
                this.status == 'employee' ? false : true
            )
            .subscribe(
                (response) => {
                    this.vehicleReqDataSource.data = response;
                    console.log(this.vehicleReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch vehicle requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }

    getReqByRole() {
        if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
            this.getFilteredVehicleReq();
        } else if (this.user.roles[0].toUpperCase() == 'EMPLOYEE') {
            this.getloggedVehicleReqs();
        } else if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getFilteredVehicleReq();
        }
    }
    getVehicleReqsByStatus() {
        this.isLoading = true;
        this._vehicleRequisitionService
            .getVehicleRequsitionByStatus(this.status)
            .subscribe(
                (response) => {
                    this.vehicleReqDataSource.data = response;
                    console.log(this.vehicleReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch vehicle requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }
    getloggedVehicleReqs() {
        this.isLoading = true;
        this._vehicleRequisitionService.getAllVehicleRequisitions().subscribe(
            (response) => {
                this.vehicleReqDataSource.data = response;
                console.log(this.vehicleReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch vehicle requisitions reload!'
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
            this.getVehicleReqsByStatus();
        } else {
            this.getReqByRole();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    createReq() {
        this._router.navigate(['axis/requsitions/vehicle/create']);
    }

    viewReqVehilce(id: string) {
        this._router.navigateByUrl(`axis/requsitions/vehicle/${id}`);
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
        this._vehicleRequisitionService.deleteVehicelRequisition(id).subscribe(
            (response) => {
                this._alertService.displayMessage('Requisition Deleted');
                this.getVehicleReqs();
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
