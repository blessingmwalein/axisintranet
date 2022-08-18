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
import { AssetRequisitionService } from 'app/modules/employee-x/services/asset-requisitions/asset-requisitions.service';

@Component({
    selector: 'academy-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetRequisitionDetailsComponent implements OnInit {
    @ViewChild('assetRequisitionSteps', { static: true }) assetRequisitionSteps: MatTabGroup;
    assetRequisition: any;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isLoading: boolean = true;
    assetReqForm: FormGroup;
    verticalStepperForm: FormGroup;

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _assetRequisitionService: AssetRequisitionService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute,
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService

    ) {
    }

    ngOnInit(): void {

        this.getAssetReq()

        this.assetReqForm = this._formBuilder.group({
            title: [''],
            status: ['Line Approved'],
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
                status: []
            }),
            step2: this._formBuilder.group({
                serialNumber: [''],
                assetCode: [''],
                id: [],
                description: [''],
                status: []
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


    getAssetReq() {
        this._assetRequisitionService.getAssetRequisition(this._activatedRoute.snapshot.params['id']).subscribe(response => {
            this.assetRequisition = response;
            this.verticalStepperForm.patchValue({
                step1: {
                    startDate: this.assetRequisition.startDate,
                    endDate: this.assetRequisition.endDate,
                    requisitionCol: this.assetRequisition.requisitionCol,
                    requestingEmployeeId: this.assetRequisition.requestingEmployeeId,
                    financeApprovedDate: this.assetRequisition.financeApprovedDate,
                    financeApproverId: this.assetRequisition.financeApproverId,
                    lineApproverId: this.assetRequisition.lineApproverId,
                    lineApproved: this.assetRequisition.lineApproved,
                    lineApprovedDate: this.assetRequisition.lineApprovedDate,
                    dateRequested: this.assetRequisition.dateRequested,
                    requestComments: this.assetRequisition.requestComments,
                    dateActioned: this.assetRequisition.dateActioned,
                    approved: this.assetRequisition.approved,
                    cancelled: this.assetRequisition.cancelled,
                    duration: this.assetRequisition.duration,
                    title: this.assetRequisition.title,
                    id: this.assetRequisition.id,
                    description: this.assetRequisition.description,
                    status: this.assetRequisition.status
                },
                step2: {
                    serialNumber: this.assetRequisition.asset.serialNumber,
                    assetCode: this.assetRequisition.asset.assetCode,
                    id: this.assetRequisition.asset.id,
                    description: this.assetRequisition.asset.description,
                    status: this.assetRequisition.asset.status
                },
                step3: {
                    id: this.assetRequisition.employee.id,
                    email: this.assetRequisition.employee.email,
                    userName: this.assetRequisition.employee.userName,
                    firstName: this.assetRequisition.employee.firstName,
                    lastName: this.assetRequisition.employee.lastName,
                    departmentsId: this.assetRequisition.employee.departmentsId,
                    phoneNumber: this.assetRequisition.employee.phoneNumber,
                    roles: this.assetRequisition.employee.roles
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
        this.assetRequisitionSteps.selectedIndex = this.currentStep;

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
        if (this.currentStep === this.assetRequisition.totalSteps - 1) {
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
        this._assetRequisitionService.lineManagerApproveReq(this.assetRequisition.id, { id: this.assetRequisition.id.toString(), lineApproved: this.assetReqForm.value.lineApproved, status: this.assetReqForm.value.status, lineApprovedDate: new Date() }).subscribe(response => {
            this._alertService.displayMessage('Requisition Approved');
            this._router.navigateByUrl('axis/manager/requisitions/asset')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
        })
    }
    rejectReqVehilce(id: string) {
        this.isLoading = true;
        this._assetRequisitionService.lineManagerApproveReq(this.assetRequisition.id, { id: this.assetRequisition.id.toString(), lineApproved: false, status: "Line manager Rejected", lineApprovedDate: new Date() }).subscribe(response => {
            this._alertService.displayMessage('Requisition Rejected');
            this._router.navigateByUrl('axis/manager/requisitions/asset')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
        })
    }

    openRejectDialog(id:string) {
        const dialogRef = this._fuseConfirmationService.open({
            message: "Are sure you want to reject this requisition ?",
            title: "Reject Requisition Confirmation"
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                this.rejectReqVehilce(id)
            }
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Requsition reject canceled')
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
        this._assetRequisitionService.deleteAssetRequisition(id).subscribe(response => {
            this._alertService.displayMessage('Requisition Deleted');
            this._router.navigateByUrl('axis/manager/requisitions/asset')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError(`Something went wrong:  ${error?.error?.message}`)
        })
    }
}
