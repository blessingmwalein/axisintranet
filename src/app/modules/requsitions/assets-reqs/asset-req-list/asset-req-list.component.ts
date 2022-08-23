import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Subject } from 'rxjs';
import { AssetRequisitionService } from '../../../employee-x/services/asset-requisitions/asset-requisitions.service';

@Component({
    selector: 'app-asset-req-list',
    templateUrl: './asset-req-list.component.html',
    styleUrls: ['./asset-req-list.component.scss'],
})
export class AssetReqListComponent implements OnInit {
    assetRequisitions: any[];
    assetReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
    assetReqTableColumns: string[] = [
        'title',
        'status',
        'duration',
        'startDate',
        'asset',
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
        private _assetRequisitionService: AssetRequisitionService,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
        console.log(this.user);
        this.getReqByRole();
        // this.getAssetReqs();
    }

    getAssetReqs() {
        this.isLoading = true;
        this._assetRequisitionService.getAllAssetRequisitions().subscribe(
            (response) => {
                this.assetReqDataSource.data = response;
                console.log(this.assetReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch asset requisitions reload!'
                );
                this.isLoading = false;
            }
        );
    }

    getFilteredCashReq() {
        this.isLoading = true;
        this._assetRequisitionService
            .getFilteredAssetRequisitionsLogged(
                this.status == 'employee' ? false : true
            )
            .subscribe(
                (response) => {
                    this.assetReqDataSource.data = response;
                    console.log(this.assetReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch asset requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }

    getReqByRole() {
        if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
            this.getFilteredCashReq();
        } else if (this.user.roles[0].toUpperCase() == 'EMPLOYEE') {
            this.getAssetReqs();
        } else if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getloggedAssetReqs();
        }
    }
    getAssetReqsByStatus() {
        this.isLoading = true;
        this._assetRequisitionService
            .getAssetRequsitionByStatus(this.status)
            .subscribe(
                (response) => {
                    this.assetReqDataSource.data = response;
                    console.log(this.assetReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch asset requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }
    getloggedAssetReqs() {
        this.isLoading = true;
        this._assetRequisitionService.getAllAssetRequisitionsLogged().subscribe(
            (response) => {
                this.assetReqDataSource.data = response;
                console.log(this.assetReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch asset requisitions reload!'
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
            this.getAssetReqsByStatus();
        } else {
            this.getReqByRole();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    createReq() {
        this._router.navigate(['axis/requsitions/asset/create']);
    }

    viewReqVehilce(id: string) {
        this._router.navigateByUrl(`axis/requsitions/asset/${id}`);
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
        this._assetRequisitionService.deleteAssetRequisition(id).subscribe(
            (response) => {
                this._alertService.displayMessage('Requisition Deleted');
                this.getAssetReqs();
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
