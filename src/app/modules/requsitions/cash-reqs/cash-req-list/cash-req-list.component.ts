import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { Subject } from 'rxjs';
import { CashRequisitionService } from '../../../employee-x/services/cash-requisitions/cash-requisitions.service';
import { ApproveReqDialogComponent } from '../details/approve-req-dialog/approve-req-dialog.component';

@Component({
    selector: 'app-cash-req-list',
    templateUrl: './cash-req-list.component.html',
    styleUrls: ['./cash-req-list.component.scss'],
})
export class CashReqListComponent implements OnInit {
    cashRequisitions: any[];
    cashReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
    cashReqTableColumns: string[] = [
        'check',
        'title',
        'status',
        'duration',
        'name',
        'startDate',
        'amount',
        'action',
    ];
    isLoading: boolean = true;
    status = 'employee';
    selectedApprove: string = "Builk";
    user: User;
    approveDataInfor: any = [];
    comment: string = '';
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _cashRequisitionService: CashRequisitionService,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService,
        private _matDialog: MatDialog,

    ) { }

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
        console.log(this.user);
        if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
            this.getReqByRole();
        } else if (
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER' ||
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER'
        ) {
            this.setStatus('Line Approved');
        } else {
            this.setStatus('Created');
        }
    }
    selectReq(isChecked, req) {
        console.log(isChecked, req);
        if (isChecked) {
            if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
                this.approveDataInfor.push({
                    id: req.id.toString(),
                    lineApproved: true,
                    status: "Line Approved",
                    lineApprovedDate: new Date(),
                });
            } else if (this.user.roles[0].toUpperCase() == 'GENERAL MANAGER') {
                this.approveDataInfor.push({
                    id: req.id.toString(),
                    gmApproved: true,
                    generalManagerApprovedDate: new Date(),
                    status: "General Approved",
                    generalManagerApproverId: this._userService.getLocalUser().id,
                });
            } else if (this.user.roles[0].toUpperCase() == 'FINANCE MANAGER') {
                this.approveDataInfor.push({
                    id: req.id.toString(),
                    financeApproved: true,
                    financeApprovedDate: new Date(),
                    status: "Finance Approved",
                    financeApproverId: this._userService.getLocalUser().id,
                });
            }
        } else {
            this.approveDataInfor = this.approveDataInfor.filter((data) => {
                return data.id != req.id.toString();
            });
        }
        console.log(this.approveDataInfor)
    }

    approveBulk() {

        // const dialogRef = this._fuseConfirmationService.open({
        //     message: `Are sure you want to approve these ${this.approveDataInfor.length} requisitions ?`,
        //     title: 'Approve  Requisitions',
        // });
        const dialogRef = this._matDialog.open(ApproveReqDialogComponent, {
            data: {
                message: `Are sure you want to approve these ${this.approveDataInfor.length} requisitions ?`,
                title: 'Approve  Requisitions',
                isApprove: true,
            },
        });
        const dialogSubmitSubscription =
            dialogRef.componentInstance.submitClicked.subscribe(result => {
                console.log(result);
                this.comment = result.comment;
                //map approver data info with comment
               this.approveDataInfor = this.approveDataInfor.map((data) => {
                    return { ...data, comment: this.comment }
                });
                if (result.value == 'confirmed') {
                    if (this.user.roles[0].toUpperCase() == 'FINANCE MANAGER') {
                        this.approveCashFinanceReq();
                    } else if (
                        this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
                    ) {
                        this.approveCashGeneralReq();
                    } else if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
                        this.approveCashLineManger();
                    }
                }
            })
        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log(result);

        // });

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

    getByMineEmployee(value) {
        this.status = value;

        this.getFilteredCashReq();
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

    //create function return hours and minutes from minutes
    getHoursAndMinutes(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const minutes_ = minutes % 60;
        return `${hours}hours ${minutes_}min`;
    }

    approveCashGeneralReq() {
        this.isLoading = true;
        this._cashRequisitionService
            .generalManagerApproveReq(this.approveDataInfor)
            .subscribe(
                (response) => {
                    this._alertService.displayMessage(
                        'Requisition approved'
                    )
                    this._router.navigateByUrl('axis/requsitions/cash');
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
    approveCashLineManger() {
        this.isLoading = true;
        this._cashRequisitionService
            .lineManagerApproveReq(this.approveDataInfor)
            .subscribe(
                (response) => {
                    this._alertService.displayMessage(
                        'Requisition approved'
                    )
                    this._router.navigateByUrl('axis/requsitions/cash');
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
    approveCashFinanceReq() {
        this.isLoading = true;
        this._cashRequisitionService
            .financeManagerApproveReq(this.approveDataInfor)
            .subscribe(
                (response) => {
                    this._alertService.displayMessage(
                        'Requisition approved'
                    )
                    this.isLoading = false;
                    this._router.navigateByUrl('axis/requsitions/cash');
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
