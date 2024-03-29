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
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DeviceRequisitionService } from 'app/modules/employee-x/services/device-requisitions/device-requisitions.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { UserService } from 'app/core/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PrintReqPrevComponent } from '../print-req-prev/print-req-prev.component';
import { NotificationsService } from 'app/modules/employee-x/services/nortifications/notifications.service';
@Component({
    selector: 'academy-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceRequisitionDetailsComponent implements OnInit {
    @ViewChild('deviceRequisitionSteps', { static: true })
    deviceRequisitionSteps: MatTabGroup;
    deviceRequisition: any;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    isLoading: boolean = true;
    deviceReqForm: FormGroup;
    verticalStepperForm: FormGroup;
    user: User;
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _deviceRequisitionService: DeviceRequisitionService,
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
        private _not: NotificationsService
    ) {}

    ngOnInit(): void {
        this.user = this._userService.getUserfromStorage();
        this.getDeviceReq();

        this.deviceReqForm = this._formBuilder.group({
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
            requestComments: [''],
            lineApproved: [true],
            gmApproved: [true],
            approved: [true],
            cancelled: [''],
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
            }),
            step2: this._formBuilder.group({
                serialNumber: [''],
                itemCode: [''],
                id: [],
                description: [''],
                status: [],
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

    getDeviceReq() {
        this._deviceRequisitionService
            .getDeviceRequisition(this._activatedRoute.snapshot.params['id'])
            .subscribe(
                (response) => {
                    this.deviceRequisition = response;
                    this.verticalStepperForm.patchValue({
                        step1: {
                            startDate: this.deviceRequisition.startDate,
                            endDate: this.deviceRequisition.endDate,
                            requisitionCol:
                                this.deviceRequisition.requisitionCol,
                            requestingEmployeeId:
                                this.deviceRequisition.requestingEmployeeId,
                            financeApprovedDate:
                                this.deviceRequisition.financeApprovedDate,
                            financeApproverId:
                                this.deviceRequisition.financeApproverId,
                            lineApproverId:
                                this.deviceRequisition.lineApproverId,
                            lineApproved: this.deviceRequisition.lineApproved,
                            lineApprovedDate:
                                this.deviceRequisition.lineApprovedDate,
                            dateRequested: this.deviceRequisition.dateRequested,
                            requestComments:
                                this.deviceRequisition.requestComments,
                            dateActioned: this.deviceRequisition.dateActioned,
                            approved: this.deviceRequisition.approved,
                            cancelled: this.deviceRequisition.cancelled,
                            duration: this.deviceRequisition.duration,
                            title: this.deviceRequisition.title,
                            id: this.deviceRequisition.id,
                            description: this.deviceRequisition.description,
                            status: this.deviceRequisition.status,
                        },
                        step2: {
                            serialNumber:
                                this.deviceRequisition.device.serialNumber,
                            itemCode: this.deviceRequisition.device.itemCode,
                            id: this.deviceRequisition.device.id,
                            description:
                                this.deviceRequisition.device.description,
                            status: this.deviceRequisition.device.status,
                        },
                        step3: {
                            id: this.deviceRequisition.employee.id,
                            email: this.deviceRequisition.employee.email,
                            userName: this.deviceRequisition.employee.userName,
                            firstName:
                                this.deviceRequisition.employee.firstName,
                            lastName: this.deviceRequisition.employee.lastName,
                            departmentsId:
                                this.deviceRequisition.employee.departmentsId,
                            phoneNumber:
                                this.deviceRequisition.employee.phoneNumber,
                            roles: this.deviceRequisition.employee.roles,
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
        this.deviceRequisitionSteps.selectedIndex = this.currentStep;

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
        if (this.currentStep === this.deviceRequisition.totalSteps - 1) {
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
                this.deteleVehicelReq(id);
            }
            if (result == 'cancelled' || result == undefined) {
                this._alertService.displayError('Requsition delete canceled');
            }
        });
    }

    deteleVehicelReq(id: string) {
        this.isLoading = true;
        this._deviceRequisitionService.deleteVehicelRequisition(id).subscribe(
            (response) => {
                this._alertService.displayMessage('Requisition Deleted');
                this._router.navigateByUrl('axis/employee/requisitions/device');
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
                    this.approveDeviceFinanceReq();
                } else if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
                    this.approveDeviceLineManger();
                }
            }
        });
    }

    approveDeviceLineManger() {
        this.isLoading = true;
        this._deviceRequisitionService
            .lineManagerApproveReq(this.deviceRequisition.id, {
                id: this.deviceRequisition.id.toString(),
                lineApproved: this.deviceReqForm.value.lineApproved,
                status: this.deviceReqForm.value.status,
                lineApprovedDate: new Date(),
            })
            .subscribe(
                (response) => {
                    this._alertService.displayMessage('Requisition Approved');
                    this.deviceReqForm.value.lineApproved
                        ? this._not
                              .sendApprovedWhatsappMessageToUser(
                                  this.deviceRequisition.employee.phoneNumber,
                                  `${this.deviceRequisition.employee.firstName} ${this.deviceRequisition.employee.lastName}`,
                                  `${
                                      this._userService.getLocalUser().firstname
                                  } ${
                                      this._userService.getLocalUser().lastname
                                  }`,
                                  'Device'
                              )
                              .subscribe(
                                  (response) => {},
                                  (error) => {}
                              )
                        : this._not
                              .sendRejectWhatsappMessageToUser(
                                  this.deviceRequisition.employee.phoneNumber,
                                  `${this.deviceRequisition.employee.firstName} ${this.deviceRequisition.employee.lastName}`,
                                  `${
                                      this._userService.getLocalUser().firstname
                                  } ${
                                      this._userService.getLocalUser().lastname
                                  }`,
                                  'Device'
                              )
                              .subscribe(
                                  (response) => {},
                                  (error) => {}
                              );
                    this._router.navigateByUrl('axis/requsitions/device');
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    this._alertService.displayError(`${error?.error?.message}`);
                }
            );
    }
    approveDeviceFinanceReq() {
        this.isLoading = true;
        this._deviceRequisitionService
            .financeManagerApproveReq(this.deviceRequisition.id, {
                id: this.deviceRequisition.id.toString(),
                approved: this.deviceReqForm.value.approved,
                financeApprovedDate: new Date(),
                status: this.deviceReqForm.value.status,
                financeApproverId: this._userService.getLocalUser().id,
            })
            .subscribe(
                (response) => {
                    this._alertService.displayMessage('Requisition Approved');

                    this.deviceReqForm.value.approved
                        ? this._not
                              .sendApprovedWhatsappMessageToUser(
                                  this.deviceRequisition.employee.phoneNumber,
                                  `${this.deviceRequisition.employee.firstName} ${this.deviceRequisition.employee.lastName}`,
                                  `${
                                      this._userService.getLocalUser().firstname
                                  } ${
                                      this._userService.getLocalUser().lastname
                                  }`,
                                  'Device'
                              )
                              .subscribe(
                                  (response) => {},
                                  (error) => {}
                              )
                        : this._not
                              .sendRejectWhatsappMessageToUser(
                                  this.deviceRequisition.employee.phoneNumber,
                                  `${this.deviceRequisition.employee.firstName} ${this.deviceRequisition.employee.lastName}`,
                                  `${
                                      this._userService.getLocalUser().firstname
                                  } ${
                                      this._userService.getLocalUser().lastname
                                  }`,
                                  'Device'
                              )
                              .subscribe(
                                  (response) => {},
                                  (error) => {}
                              );
                    this._router.navigateByUrl('axis/requsitions/device');
                    this.isLoading = false;
                },
                (error) => {
                    this.isLoading = false;
                    this._alertService.displayError(`${error?.error?.message}`);
                }
            );
    }
    rejectReqCash(id: string) {
        this.isLoading = true;
        this._deviceRequisitionService
            .lineManagerApproveReq(this.deviceRequisition.id, {
                id: this.deviceRequisition.id.toString(),
                lineApproved: !this.deviceReqForm.value.lineApproved,
                status: 'Line manager rejected',
                lineApprovedDate: new Date(),
            })
            .subscribe(
                (response) => {
                    this._alertService.displayMessage('Requisition Rejected');
                    this._router.navigateByUrl('axis/requsitions/device');
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
                    this.deviceReqForm.patchValue({
                        status: 'Finance manager rejected',
                        approved: false,
                    });
                    this.approveDeviceFinanceReq();
                } else if (this.user.roles[0].toUpperCase() == 'LINE MANAGER') {
                    this.deviceReqForm.patchValue({
                        status: 'Line manager rejected',
                        lineApproved: false,
                    });
                    this.approveDeviceLineManger();
                }
            }
        });
    }

    openPrintDialog(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(PrintReqPrevComponent, {
            data: { isEdit: false, deviceRequisition: this.deviceRequisition },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
            // this();
        });
    }
}
