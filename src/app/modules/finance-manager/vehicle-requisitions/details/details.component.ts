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
import { ApproveReqComponent } from '../approve-req/approve-req.component';
import { MatDialog } from '@angular/material/dialog';
import { VehicleRequisition } from 'app/modules/employee-x/models/vehicle-requisitions/vehicle-requisitions.types';
import { VehicleRequisitionService } from 'app/modules/employee-x/services/vehicle-requisitions/vehicle-requisitions.service';
import { UserService } from 'app/core/user/user.service';
import { PrintReqPrevComponent } from '../print-req-prev/print-req-prev.component';

@Component({
    selector: 'academy-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleRequisitionDetailsComponent implements OnInit {
    @ViewChild('vehicleRequisitionSteps', { static: true }) vehicleRequisitionSteps: MatTabGroup;
    vehicleRequisition: any;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isLoading: boolean = true;
    vehicleReqForm: FormGroup;
    verticalStepperForm: FormGroup;
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _vehicleRequisitionService: VehicleRequisitionService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute,
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private _userService: UserService
    ) {
    }

    ngOnInit(): void {

        this.getVehicleReq()

        this.vehicleReqForm = this._formBuilder.group({
            title: [''],
            status: ['Finance manager approved'],
            description: [''],
            duration: [''],
            startDate: [''],
            endDate: [''],
            financeApprovedDate: [''],
            lineApprovedDate: [''],
            requestComments: [''],
            approved: [''],
            cancelled: [''],
            id: [''],
            lineApproved: [true],
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
                regNumber: [''],
                lastServiceDate: [''],
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


    getVehicleReq() {
        this._vehicleRequisitionService.getVehicelRequisition(this._activatedRoute.snapshot.params['id']).subscribe(response => {
            this.vehicleRequisition = response;
            this.verticalStepperForm.patchValue({
                step1: {
                    startDate: this.vehicleRequisition.startDate,
                    endDate: this.vehicleRequisition.endDate,
                    requisitionCol: this.vehicleRequisition.requisitionCol,
                    requestingEmployeeId: this.vehicleRequisition.requestingEmployeeId,
                    financeApprovedDate: this.vehicleRequisition.financeApprovedDate,
                    financeApproverId: this.vehicleRequisition.financeApproverId,
                    lineApproverId: this.vehicleRequisition.lineApproverId,
                    lineApproved: this.vehicleRequisition.lineApproved,
                    lineApprovedDate: this.vehicleRequisition.lineApprovedDate,
                    dateRequested: this.vehicleRequisition.dateRequested,
                    requestComments: this.vehicleRequisition.requestComments,
                    dateActioned: this.vehicleRequisition.dateActioned,
                    approved: this.vehicleRequisition.approved,
                    cancelled: this.vehicleRequisition.cancelled,
                    duration: this.vehicleRequisition.duration,
                    title: this.vehicleRequisition.title,
                    id: this.vehicleRequisition.id,
                    description: this.vehicleRequisition.description,
                    status: this.vehicleRequisition.status
                },
                step2: {
                    regNumber: this.vehicleRequisition.vehicle.regNumber,
                    lastServiceDate: this.vehicleRequisition.vehicle.lastServiceDate,
                    id: this.vehicleRequisition.vehicle.id,
                    description: this.vehicleRequisition.vehicle.description,
                    status: this.vehicleRequisition.vehicle.status
                },
                step3: {
                    id: this.vehicleRequisition.employee.id,
                    email: this.vehicleRequisition.employee.email,
                    userName: this.vehicleRequisition.employee.userName,
                    firstName: this.vehicleRequisition.employee.firstName,
                    lastName: this.vehicleRequisition.employee.lastName,
                    departmentsId: this.vehicleRequisition.employee.departmentsId,
                    phoneNumber: this.vehicleRequisition.employee.phoneNumber,
                    roles: this.vehicleRequisition.employee.roles
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
        this.vehicleRequisitionSteps.selectedIndex = this.currentStep;

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
        if (this.currentStep === this.vehicleRequisition.totalSteps - 1) {
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
            message: "Are sure you want to decline this requisition ?",
            title: "Delete Requisition Confirmation"
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == 'confirmed') {
                // this.deteleVehicelReq(id)
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
                this.approveVehicleReq()
            }
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Department delete canceled')
            }
        });
    }
    approveVehicleReq() {
        this.isLoading = true;
        this._vehicleRequisitionService.financeManagerApproveReq(this.vehicleRequisition.id, { id: this.vehicleRequisition.id.toString(), approved: true, status: this.vehicleReqForm.value.status, financeApprovedDate: new Date(), financeApproverId: this._userService.getLocalUser().id }).subscribe(response => {
            this._alertService.displayMessage('Requisition Approved');
            this._router.navigateByUrl('axis/finance-manager/requisitions/vehicle')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError('Try again')
        })
    }

    deteleVehicelReq(id: string) {
        this.isLoading = true;
        this._vehicleRequisitionService.deleteVehicelRequisition(id).subscribe(response => {
            this._alertService.displayMessage('Requisition Deleted');
            this._router.navigateByUrl('axis/finance-manager/requisitions/vehicle')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError('Try again')
        })
    }
    rejectReqVehilce(id: string) {
        this.isLoading = true;
        this._vehicleRequisitionService.financeManagerApproveReq(this.vehicleRequisition.id, { id: this.vehicleRequisition.id.toString(), approved: false, status: "Finace Manager rejected", financeApprovedDate: new Date(), financeApproverId: this._userService.getLocalUser().id }).subscribe(response => {
            this._alertService.displayMessage('Requisition Rejected');
            this._router.navigateByUrl('axis/finance-manager/requisitions/vehicle')
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this._alertService.displayError('Try again')
        })
    }

    openRejectDialog(id: string) {
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

    openPrintDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(PrintReqPrevComponent, {
            data: { isEdit: false, vehicleRequisition: this.vehicleRequisition },
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!');
                // this();
            });
    }
}
