import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CardRequisitionService } from '../../services/card-requisitions/card-requisitions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUsedFundsComponent } from '../update-used-funds/update-used-funds.component';
import { UpdateReceivedFundsComponent } from '../update-received-funds/update-received-funds.component';
import { PreviewFileComponent } from '../../cash-requisition/preview-file/preview-file.component';

@Component({
    selector: 'academy-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardRequisitionDetailsComponent implements OnInit {
    @ViewChild('cardRequisitionSteps', { static: true }) cardRequisitionSteps: MatTabGroup;
    cardRequisition: any;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isLoading: boolean = true;
    cardReqForm: FormGroup;
    verticalStepperForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _cardRequisitionService: CardRequisitionService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute,
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,

    ) {
    }

    ngOnInit(): void {

        this.getCardReq()

        this.cardReqForm = this._formBuilder.group({
            title: [''],
            status: [''],
            description: [''],
            duration: [''],
            startDate: [''],
            endDate: [''],
            financeApprovedDate: [''],
            lineApprovedDate: [''],
            requestComments: [''],
            approved: [''],
            cancelled: [''],
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
                amount: [],
                releasedFunds: [],
                receivedFunds: [],
                actualUsedFunds: [],
            }),
            step2: this._formBuilder.group({
                id: [],
                description: [''],
                status: [''],
                cardNumber: [''],
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


    getCardReq() {
        this._cardRequisitionService.getCardRequisition(this._activatedRoute.snapshot.params['id']).subscribe(response => {
            this.cardRequisition = response;
            this.verticalStepperForm.patchValue({
                step1: {
                    startDate: this.cardRequisition.startDate,
                    endDate: this.cardRequisition.endDate,
                    requisitionCol: this.cardRequisition.requisitionCol,
                    requestingEmployeeId: this.cardRequisition.requestingEmployeeId,
                    financeApprovedDate: this.cardRequisition.financeApprovedDate,
                    financeApproverId: this.cardRequisition.financeApproverId,
                    lineApproverId: this.cardRequisition.lineApproverId,
                    lineApproved: this.cardRequisition.lineApproved,
                    lineApprovedDate: this.cardRequisition.lineApprovedDate,
                    dateRequested: this.cardRequisition.dateRequested,
                    requestComments: this.cardRequisition.requestComments,
                    dateActioned: this.cardRequisition.dateActioned,
                    approved: this.cardRequisition.approved,
                    cancelled: this.cardRequisition.cancelled,
                    duration: this.cardRequisition.duration,
                    title: this.cardRequisition.title,
                    id: this.cardRequisition.id,
                    description: this.cardRequisition.description,
                    status: this.cardRequisition.status,
                    amount: this.cardRequisition.amount,
                    releasedFunds: this.cardRequisition.releasedFunds,
                    receivedFunds: this.cardRequisition.receivedFunds,
                    actualUsedFunds: this.cardRequisition.actualUsedFunds
                },
                step2: {
                    id: this.cardRequisition.card.id,
                    description: this.cardRequisition.card.description,
                    status: this.cardRequisition.card.status,
                    cardNumber: this.cardRequisition.card.cardNumber,
                    currency: this.cardRequisition.card.currency,
                    amount: this.cardRequisition.card.amount
                },
                step3: {
                    id: this.cardRequisition.employee.id,
                    email: this.cardRequisition.employee.email,
                    userName: this.cardRequisition.employee.userName,
                    firstName: this.cardRequisition.employee.firstName,
                    lastName: this.cardRequisition.employee.lastName,
                    departmentsId: this.cardRequisition.employee.departmentsId,
                    phoneNumber: this.cardRequisition.employee.phoneNumber,
                    roles: this.cardRequisition.employee.roles
                }
            })
            // this.verticalStepperForm.disable()
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
        this.cardRequisitionSteps.selectedIndex = this.currentStep;

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
        if (this.currentStep === this.cardRequisition.totalSteps - 1) {
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

    deteleVehicelReq(id: string) {
        this.isLoading = true;
        this._cardRequisitionService.deleteVehicelRequisition(id).subscribe(response => {
            this._alertService.displayMessage('Requisition Deleted');
            this._router.navigateByUrl('axis/employee/requisitions/card')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
        })
    }
    openUpdateCashUsed(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateUsedFundsComponent, {
            data: { cardReq: this.cardRequisition },
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
                this.getCardReq();
            });
    }
    openUpdateCashReceuvedDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(UpdateReceivedFundsComponent, {
            data: { cardReq: this.cardRequisition },
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
                this.getCardReq();
            });
    }

    onFileUpload() {
        const dialogRef = this._matDialog.open(PreviewFileComponent, {
            data: { uploadedFileName: this.cardRequisition.uploadedFileName },
            width:"700px",
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }
}
