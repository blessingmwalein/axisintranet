import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';
import { ApproveReqDialogComponent } from '../../cash-reqs/details/approve-req-dialog/approve-req-dialog.component';

@Component({
    selector: 'app-card-req-list',
    templateUrl: './card-req-list.component.html',
    styleUrls: ['./card-req-list.component.scss'],
})
export class CardReqListComponent implements OnInit {
    cardRequisitions: any[];
    cardReqDataSource: MatTableDataSource<any> = new MatTableDataSource();
    cardReqTableColumns: string[] = [
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
    user: User;
    status = 'employee';
    approveDataInfor: any = [];
    comment: string = '';

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _cardRequisitionService: CardRequisitionService,
        private _alertService: AlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _userService: UserService,
        private _matDialog: MatDialog,

    ) { }

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
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
        // this.getReqByRole();
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
    getCardReqs() {
        this.isLoading = true;
        this._cardRequisitionService.getAllCardRequisitions().subscribe(
            (response) => {
                this.cardReqDataSource.data = response;
                console.log(this.cardReqDataSource.data);
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Could not fetch card requisitions reload!'
                );
                this.isLoading = false;
            }
        );
    }

    getFilteredCashReq() {
        this.isLoading = true;
        this._cardRequisitionService
            .getFilteredCardRequisitions(
                this.status == 'employee' ? false : true
            )
            .subscribe(
                (response) => {
                    this.cardReqDataSource.data = response;
                    console.log(this.cardReqDataSource.data);
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
            this.getCardReqs();
        } else if (
            this.user.roles[0].toUpperCase() == 'FINANCE MANAGER' ||
            this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
        ) {
            this.getloggedCashReqs();
        }
    }
    getCashReqsByStatus() {
        this.isLoading = true;
        this._cardRequisitionService
            .getCardRequsitionByStatus(this.status)
            .subscribe(
                (response) => {
                    this.cardReqDataSource.data = response;
                    console.log(this.cardReqDataSource.data);
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
        this._cardRequisitionService.getAllCardRequisitionsLogged().subscribe(
            (response) => {
                this.cardReqDataSource.data = response;
                console.log(this.cardReqDataSource.data);
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
        this._router.navigate(['axis/requsitions/card/create']);
    }

    viewReqVehilce(id: string) {
        this._router.navigateByUrl(`axis/requsitions/card/${id}`);
    }

    getHoursAndMinutes(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const minutes_ = minutes % 60;
        return `${hours}hours ${minutes_}min`;
    }

    getByMineEmployee(value) {
        this.status = value;

        this.getFilteredCashReq();
    }

    approveBulk() {

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
                this.approveDataInfor = this.approveDataInfor.map((data) => {
                    return { ...data, comment: this.comment }
                });

                if (result == 'confirmed') {
                    if (this.user.roles[0].toUpperCase() == 'FINANCE MANAGER') {
                        this.approveCardFinanceReq();
                    } else if (
                        this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
                    ) {
                        this.approveCardGeneralReq();
                    } else if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
                        this.approveCardLineManger();
                    }
                }

            })
    }

    approveCardGeneralReq() {
        this.isLoading = true;
        this._cardRequisitionService
            .generalManagerApproveReq(this.approveDataInfor)
            .subscribe(
                (response) => {
                    this._alertService.displayMessage(
                        'Requisition approved'
                    )
                    this._router.navigateByUrl('axis/requsitions/card');
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
    approveCardLineManger() {
        this.isLoading = true;
        this._cardRequisitionService
            .lineManagerApproveReq(this.approveDataInfor)
            .subscribe(
                (response) => {
                    this._alertService.displayMessage(
                        'Requisition approved'
                    )
                    this._router.navigateByUrl('axis/requsitions/card');
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
    approveCardFinanceReq() {
        this.isLoading = true;
        this._cardRequisitionService
            .financeManagerApproveReq(this.approveDataInfor)
            .subscribe(
                (response) => {
                    this._alertService.displayMessage(
                        'Requisition approved'
                    )
                    this.isLoading = false;
                    this._router.navigateByUrl('axis/requsitions/card');
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
