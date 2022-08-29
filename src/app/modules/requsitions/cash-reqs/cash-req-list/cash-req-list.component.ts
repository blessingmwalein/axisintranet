import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Subject } from 'rxjs';
import { CashRequisitionService } from '../../../employee-x/services/cash-requisitions/cash-requisitions.service';

@Component({
    selector: 'app-cash-req-list',
    templateUrl: './cash-req-list.component.html',
    styleUrls: ['./cash-req-list.component.scss'],
})
export class CashReqListComponent implements OnInit {
    cashRequisitions: any[];
    cashReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
    cashReqTableColumns: string[] = [
        'title',
        'status',
        'duration',
        'startDate',
        'endDate',
        'amount',
        'action',
    ];
    isLoading: boolean = true;
    status = 'employee';
    user: User;
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _cashRequisitionService: CashRequisitionService,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        //set user type
        this.user = this._userService.getUserfromStorage();
        console.log(this.user);
        this.getReqByRole();
    }

    getCashReqs() {
        this.isLoading = true;
        this._cashRequisitionService.getAllCashRequisitions().subscribe(
            (response) => {
                this.cashReqDataSource.data = response;
                console.log(this.cashReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch cash requisitions reload!'
                );
                this.isLoading = false;
            }
        );
    }

    getFilteredCashReq() {
        this.isLoading = true;
        this._cashRequisitionService
            .getFilteredCashRequisitions(
                this.status == 'employee' ? false : true
            )
            .subscribe(
                (response) => {
                    this.cashReqDataSource.data = response;
                    console.log(this.cashReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch cash requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }

    getReqByRole() {
        if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
            this.getFilteredCashReq();
        } else if (this.user.roles[0].toUpperCase() == 'EMPLOYEE') {
            this.getCashReqs();
        } else if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getloggedCashReqs();
        }
    }
    getCashReqsByStatus() {
        this.isLoading = true;
        this._cashRequisitionService
            .getCashRequsitionByStatus(this.status)
            .subscribe(
                (response) => {
                    this.cashReqDataSource.data = response;
                    console.log(this.cashReqDataSource.data);
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this._alertService.displayError(
                        'Could not fetch cash requisitions reload!'
                    );
                    this.isLoading = false;
                }
            );
    }
    getloggedCashReqs() {
        this.isLoading = true;
        this._cashRequisitionService.getAllCashRequisitionsLogged().subscribe(
            (response) => {
                this.cashReqDataSource.data = response;
                console.log(this.cashReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch cash requisitions reload!'
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
            this.getCashReqsByStatus();
        } else {
            this.getReqByRole();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    createReq() {
        this._router.navigate(['axis/requsitions/cash/create']);
    }

    viewCashreqSingle(id: string) {
        this._router.navigateByUrl(`axis/requsitions/cash/${id}`);
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
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Department delete canceled');
            }
        });
    }

    deteleVehicelReq(id: string) {
        this.isLoading = true;
        this._cashRequisitionService.deleteVehicelRequisition(id).subscribe(
            (response) => {
                this._alertService.displayMessage('Requisition Deleted');
                this.getCashReqs();
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