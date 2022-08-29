import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Category } from '../../../employee-x/models/cash-requisitions/cash-requisitions.types';
import { CashRequisitionService } from '../../../employee-x/services/cash-requisitions/cash-requisitions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UpdateUsedFundsComponent } from '../update-used-funds/update-used-funds.component';
import { UpdateReceivedFundsComponent } from '../update-received-funds/update-received-funds.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PreviewFileComponent } from '../preview-file/preview-file.component';
import { User } from 'app/modules/admin/models/users/users.types';
import { UserService } from 'app/core/user/user.service';
import { UpdateReleasedFundsComponent } from '../update-released-funds/update-released-funds.component';
import { PrintReqPrevComponent } from '../print-req-prev/print-req-prev.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'academy-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashRequisitionDetailsComponent implements OnInit {
    @ViewChild('cashRequisitionSteps', { static: true })
    cashRequisitionSteps: MatTabGroup;
    cashRequisition: any;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isLoading: boolean = true;
    cashReqForm: FormGroup;
    verticalStepperForm: FormGroup;
    cashs: any[];
    image: SafeUrl;
    user: User;
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _cashRequisitionService: CashRequisitionService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute,
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private sanitizer: DomSanitizer,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
        this.getCashReq();
        this._cashRequisitionService.getCashs().subscribe((data) => {
            this.cashs = data;
        });
        this.cashReqForm = this._formBuilder.group({
            title: [''],
            status: [
                this.user.roles[0].toUpperCase() == 'FINANCE MANAGER'
                    ? 'Finance Approved'
                    : this.user.roles[0].toUpperCase() == 'LINE MANAGER'
                    ? 'Line Approved'
                    : this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
                    ? 'General Approved'
                    : '',
            ],
            description: [''],
            duration: [''],
            startDate: [''],
            endDate: [''],
            financeApprovedDate: [''],
            lineApprovedDate: [''],
            lineApproved: [true],
            gmApproved: [true],
            approved: [true],
            requestComments: [''],
            cancelled: [''],
            cashId: [''],
        });
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                startDate: [''],
                endDate: [''],
                requisitionCol: [''],
                requestingEmployeeId: [''],
                financeApprovedDate: [''],
                financeApproverId: [''],
                lineApproverId: [''],
                lineApproved: [''],
                lineApprovedDate: [''],
                dateRequested: [''],
                requestComments: [''],
                dateActioned: [''],
                approved: [''],
                cancelled: [],
                duration: [],
                title: [],
                id: [],
                description: [],
                status: [],
                amount: [],
                releasedFunds: [],
                receivedFunds: [],
                actualUsedFunds: [],
                fileSource: [''],
                uploadedFileName: [''],
            }),
            step2: this._formBuilder.group({
                id: [],
                description: [''],
                status: [''],
                currencyCode: [''],
                currency: [''],
                amount: [],
            }),
            step3: this._formBuilder.group({
                id: [''],
                email: [''],
                userName: [''],
                firstName: [''],
                lastName: [''],
                departmentsId: [''],
                phoneNumber: [''],
                roles: [''],
            }),
        });
    }

    getCashReq() {
        this._cashRequisitionService
            .getCashRequisition(this._activatedRoute.snapshot.params['id'])
            .subscribe(
                (response) => {
                    this.cashRequisition = response;
                    this.image = this.sanitizer.bypassSecurityTrustUrl(
                        this.cashRequisition.fileSource
                    );
                    this.verticalStepperForm.patchValue({
                        step1: {
                            startDate: this.cashRequisition?.startDate,
                            endDate: this.cashRequisition?.endDate,
                            requisitionCol: this.cashRequisition.requisitionCol,
                            requestingEmployeeId:
                                this.cashRequisition.requestingEmployeeId,
                            financeApprovedDate:
                                this.cashRequisition.financeApprovedDate,
                            financeApproverId:
                                this.cashRequisition.financeApproverId,
                            lineApproverId: this.cashRequisition.lineApproverId,
                            lineApproved: this.cashRequisition?.lineApproved,
                            lineApprovedDate:
                                this.cashRequisition.lineApprovedDate,
                            dateRequested: this.cashRequisition?.dateRequested,
                            requestComments:
                                this.cashRequisition.requestComments,
                            dateActioned: this.cashRequisition.dateActioned,
                            approved: this.cashRequisition?.approved,
                            cancelled: this.cashRequisition.cancelled,
                            duration: this.getHoursAndMinutes(
                                this.cashRequisition.duration
                            ),
                            title: this.cashRequisition.title,
                            id: this.cashRequisition.id,
                            description: this.cashRequisition.description,
                            status: this.cashRequisition.status,
                            amount: this.cashRequisition.amount,
                            releasedFunds: this.cashRequisition.releasedFunds,
                            receivedFunds: this.cashRequisition.receivedFunds,
                            actualUsedFunds:
                                this.cashRequisition.actualUsedFunds,
                            fileSource: this.cashRequisition.fileSource,
                            uploadedFileName:
                                this.cashRequisition.uploadedFileName,
                        },
                        step2: {
                            id: this.cashRequisition.cash.id,
                            description: this.cashRequisition.cash.description,
                            status: this.cashRequisition.cash.status,
                            currencyCode:
                                this.cashRequisition.cash.currencyCode,
                            currency: this.cashRequisition.cash.currency,
                            amount: this.cashRequisition.cash.amount,
                        },
                        step3: {
                            id: this.cashRequisition.employee.id,
                            email: this.cashRequisition.employee.email,
                            userName: this.cashRequisition.employee.userName,
                            firstName: this.cashRequisition.employee.firstName,
                            lastName: this.cashRequisition.employee.lastName,
                            departmentsId:
                                this.cashRequisition.employee.departmentsId,
                            phoneNumber:
                                this.cashRequisition.employee.phoneNumber,
                            roles: this.cashRequisition.employee.roles,
                        },
                    });
                    this.isLoading = false;
                },
                (error) => {
                    console.log(error);
                    this.isLoading = false;
                    this._alertService.displayError(
                        'Failed to load requisition reload the page'
                    );
                }
            );
    }

    goToStep(step: number): void {
        // Set the current step
        this.currentStep = step;

        // Go to the step
        this.cashRequisitionSteps.selectedIndex = this.currentStep;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Go to previous step
     */
    goToPreviousStep(): void {
        // Return if we already on the first step
        if (this.currentStep === 0) {
            return;
        }

        // Go to step
        this.goToStep(this.currentStep - 1);

        // Scroll the current step selector from sidenav into view
        this._scrollCurrentStepElementIntoView();
    }

    /**
     * Go to next step
     */
    goToNextStep(): void {
        // Return if we already on the last step
        if (this.currentStep === this.cashRequisition.totalSteps - 1) {
            return;
        }

        // Go to step
        this.goToStep(this.currentStep + 1);

        // Scroll the current step selector from sidenav into view
        this._scrollCurrentStepElementIntoView();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _scrollCurrentStepElementIntoView(): void {
        // Wrap everything into setTimeout so we can make sure that the 'current-step' class points to correct element
        setTimeout(() => {
            // Get the current step element and scroll it into view
            const currentStepElement =
                this._document.getElementsByClassName('current-step')[0];
            if (currentStepElement) {
                currentStepElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    }

    openDeleteDialog(id: string) {
        const dialogRef = this._fuseConfirmationService.open({
            message: 'Are sure you want to delete this requisition ?',
            title: 'Delete Requisition Confirmation',
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                // this.deteleVehicelReq(id);
            }
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Requsition delete canceled');
            }
        });
    }

    openCreateDepartmentDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateUsedFundsComponent, {
            data: { cashReq: this.cashRequisition },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            this.getCashReq();
        });
    }
    openUpdateCashReceuvedDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateReceivedFundsComponent, {
            data: { cashReq: this.cashRequisition },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            this.getCashReq();
        });
    }
    onFileUpload() {
        // const dialogRef = this._matDialog.open(PreviewFileComponent, {
        //     data: { uploadedFileName: this.cashRequisition.uploadedFileName },
        //     width: '700px',
        // });

        // dialogRef.afterClosed().subscribe((result) => {
        //     console.log('Compose dialog was closed!');
        // });

        window.open(
            `${environment.filesBaseUrl}${this.cashRequisition.uploadedFileName}`
        );
    }

    //manager operations
    openApproveDialog() {
        const dialogRef = this._fuseConfirmationService.open({
            message: 'Are sure you want to approve this requisition ?',
            title: 'Approve  Requisition',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
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
        });
    }
    approveCashGeneralReq() {
        this.isLoading = true;
        this._cashRequisitionService
            .generalManagerApproveReq(this.cashRequisition.id, {
                id: this.cashRequisition.id.toString(),
                approved: this.cashReqForm.value.gmApproved,
                generalManagerApprovedDate: new Date(),
                status: this.cashReqForm.value.status,
                generalManagerApproverId: this._userService.getLocalUser().id,
            })
            .subscribe(
                (response) => {
                    this.cashReqForm.value.gmApproved
                        ? this._alertService.displayMessage(
                              'Requisition approved'
                          )
                        : this._alertService.displayError(
                              'Requisition rejected'
                          );
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
            .lineManagerApproveReq(this.cashRequisition.id, {
                id: this.cashRequisition.id.toString(),
                lineApproved: this.cashReqForm.value.lineApproved,
                status: this.cashReqForm.value.status,
                lineApprovedDate: new Date(),
            })
            .subscribe(
                (response) => {
                    this.cashReqForm.value.lineApproved
                        ? this._alertService.displayMessage(
                              'Requisition approved'
                          )
                        : this._alertService.displayError(
                              'Requisition rejected'
                          );
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
            .financeManagerApproveReq(this.cashRequisition.id, {
                id: this.cashRequisition.id.toString(),
                approved: this.cashReqForm.value.approved,
                financeApprovedDate: new Date(),
                status: this.cashReqForm.value.status,
                financeApproverId: this._userService.getLocalUser().id,
            })
            .subscribe(
                (response) => {
                    this.cashReqForm.value.approved
                        ? this._alertService.displayMessage(
                              'Requisition approved'
                          )
                        : this._alertService.displayError(
                              'Requisition rejected'
                          );
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
    openRejectDialog(id: string) {
        const dialogRef = this._fuseConfirmationService.open({
            message: 'Are sure you want to reject this requisition ?',
            title: 'Reject Requisition Confirmation',
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                if (this.user.roles[0].toUpperCase() == 'FINANCE MANAGER') {
                    this.cashReqForm.patchValue({
                        status: 'Finance manager rejected',
                        approved: false,
                    });
                    this.approveCashFinanceReq();
                } else if (
                    this.user.roles[0].toUpperCase() == 'GENERAL MANAGER'
                ) {
                    this.cashReqForm.patchValue({
                        status: 'General manager rejected',
                        gmApproved: false,
                    });
                    this.approveCashGeneralReq();
                } else if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
                    this.cashReqForm.patchValue({
                        status: 'Line manager rejected',
                        lineApproved: false,
                    });
                    this.approveCashLineManger();
                }
            }
        });
    }
    openUpdateReleasedFunds(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateReleasedFundsComponent, {
            data: { cashReq: this.cashRequisition },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            this.getCashReq();
        });
    }
    openPrintDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(PrintReqPrevComponent, {
            data: { isEdit: false, cashRequisition: this.cashRequisition },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            // this();
        });
    }

    //create function return hours and minutes from minutes
    getHoursAndMinutes(minutes: number) {
        const hours = Math.floor(minutes / 60);
        const minutes_ = minutes % 60;
        return `${hours}hours ${minutes_}minutes`;
    }
}
