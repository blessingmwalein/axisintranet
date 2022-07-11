import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';
import { UserService } from 'app/core/user/user.service';
import { PrintReqPrevComponent } from '../print-req-prev/print-req-prev.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'academy-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashRequisitionDetailsComponent implements OnInit {
    @ViewChild('cashRequisitionSteps', { static: true }) cashRequisitionSteps: MatTabGroup;
    cashRequisition: any;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isLoading: boolean = true;
    cashReqForm: FormGroup;
    verticalStepperForm: FormGroup;
    cashs: any[];
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
        private _userService: UserService,
        private _matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {

        this.getCashReq()
        this._cashRequisitionService.getCashs().subscribe(data => {
            this.cashs = data;
        })
        this.cashReqForm = this._formBuilder.group({
            title: [''],
            status: ['General Manager Approved'],
            description: [''],
            duration: [''],
            startDate: [''],
            endDate: [''],
            financeApprovedDate: [''],
            lineApprovedDate: [''],
            lineApproved: [true],
            requestComments: [''],
            approved: [''],
            cancelled: [''],
            cashId: ['']
        });
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                startDate: [""],
                endDate: [""],
                requisitionCol: [""],
                requestingEmployeeId: [""],
                financeApprovedDate: [""],
                financeApproverId: [""],
                lineApproverId: [""],
                lineApproved: [""],
                lineApprovedDate: [""],
                dateRequested: [""],
                requestComments: [""],
                dateActioned: [""],
                approved: [""],
                cancelled: [],
                duration: [],
                title: [],
                id: [],
                description: [],
                status: [],
                amount: []
            }),
            step2: this._formBuilder.group({
                id: [],
                description: [''],
                status: [''],
                currencyCode: [''],
                currency: [''],
                amount: []
            }),
            step3: this._formBuilder.group({
                id: [''],
                email: [''],
                userName: [''],
                firstName: [''],
                lastName: [''],
                departmentsId: [''],
                phoneNumber: [''],
                roles: ['']
            })
        });
    }


    getCashReq() {
        this._cashRequisitionService.getCashRequisition(this._activatedRoute.snapshot.params['id']).subscribe(response => {
            this.cashRequisition = response;
            this.verticalStepperForm.patchValue({
                step1: {
                    startDate: this.cashRequisition.startDate,
                    endDate: this.cashRequisition.endDate,
                    requisitionCol: this.cashRequisition.requisitionCol,
                    requestingEmployeeId: this.cashRequisition.requestingEmployeeId,
                    financeApprovedDate: this.cashRequisition.financeApprovedDate,
                    financeApproverId: this.cashRequisition.financeApproverId,
                    lineApproverId: this.cashRequisition.lineApproverId,
                    lineApproved: this.cashRequisition.lineApproved,
                    lineApprovedDate: this.cashRequisition.lineApprovedDate,
                    dateRequested: this.cashRequisition.dateRequested,
                    requestComments: this.cashRequisition.requestComments,
                    dateActioned: this.cashRequisition.dateActioned,
                    approved: this.cashRequisition.approved,
                    cancelled: this.cashRequisition.cancelled,
                    duration: this.cashRequisition.duration,
                    title: this.cashRequisition.title,
                    id: this.cashRequisition.id,
                    description: this.cashRequisition.description,
                    status: this.cashRequisition.status,
                    amount: this.cashRequisition.amount
                },
                step2: {
                    id: this.cashRequisition.cash.id,
                    description: this.cashRequisition.cash.description,
                    status: this.cashRequisition.cash.status,
                    currencyCode: this.cashRequisition.cash.currencyCode,
                    currency: this.cashRequisition.cash.currency,
                    amount: this.cashRequisition.cash.amount
                },
                step3: {
                    id: this.cashRequisition.employee.id,
                    email: this.cashRequisition.employee.email,
                    userName: this.cashRequisition.employee.userName,
                    firstName: this.cashRequisition.employee.firstName,
                    lastName: this.cashRequisition.employee.lastName,
                    departmentsId: this.cashRequisition.employee.departmentsId,
                    phoneNumber: this.cashRequisition.employee.phoneNumber,
                    roles: this.cashRequisition.employee.roles
                }
            })
            this.isLoading = false
        }, error => {
            console.log(error);
            this.isLoading = false;
            this._alertService.displayError("Failed to load requisition reload the page")
        })
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
            const currentStepElement = this._document.getElementsByClassName('current-step')[0];
            if (currentStepElement) {
                currentStepElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    openDeleteDialog(id: string) {
        const dialogRef = this._fuseConfirmationService.open({
            message: "Are sure you want to delete this requisition ?",
            title: "Delete Requisition Confirmation"
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                this.deteleVehicelReq(id)
            }
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Requsition delete canceled')
            }
        });
    }
    openApproveDialog() {
        const dialogRef = this._fuseConfirmationService.open({
            message: "Are sure you want to approve this requisition ?",
            title: "Approve  Requisition"
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                this.approveCashReq()
            }
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Department delete canceled')
            }
        });
    }
    approveCashReq() {

        this.isLoading = true;
        this._cashRequisitionService.generalManagerApproveReq(this.cashRequisition.id, { id: this.cashRequisition.id.toString(), approved: true, financeApprovedDate: new Date(), status: this.cashReqForm.value.status, financeApproverId: this._userService.getLocalUser().id }).subscribe(response => {
            this._alertService.displayMessage('Requisition Approved');
            this._router.navigateByUrl('axis/g-m/requisitions/cash')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError('Try again')
        })
    }
    deteleVehicelReq(id: string) {
        this.isLoading = true;
        this._cashRequisitionService.deleteVehicelRequisition(id).subscribe(response => {
            this._alertService.displayMessage('Requisition Deleted');
            this._router.navigateByUrl('axis/g-m/requisitions/cash')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError('Try again')
        })
    }

    openPrintDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(PrintReqPrevComponent, {
            data: { isEdit: false, cashRequisition: this.cashRequisition },
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
                // this();
            });
    }
    getDisableButton() {
        console.log("Status " + this.cashRequisition.amount > this.cashRequisition.cash.amount);

        if (this.cashRequisition.amount > this.cashRequisition.cash.amount) {
            if (this.cashRequisition.lineApproved) {
                return false;
            }
            else {
                return true;
            }
        } else {
            return true;
        }
    }
}
