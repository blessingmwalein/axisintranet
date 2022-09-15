import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-create-cash-req',
    templateUrl: './create-cash-req.component.html',
    styleUrls: ['./create-cash-req.component.scss'],
})
export class CreateCashReqComponent implements OnInit {
    horizontalStepperForm: FormGroup;
    formFieldHelpers: string[] = [''];
    cashs: any[];
    minDate = new Date();
    isPastStartDate = false;
    startDateMin = new Date().toISOString().split('T')[0] + 'T00:00:00';
    file: File;
    errors = [];
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: 'Somthing went Wrong',
    };
    showAlert: boolean = false;
    constructor(
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _cashReqService: CashRequisitionService,
        private _router: Router,
        private _userService: UserService,
        private el: ElementRef
    ) {}

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    ngOnInit(): void {
        this.setMinDates();

        this._cashReqService.getCashs().subscribe((data) => {
            this.cashs = data;
        });

        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                requestComments: ['', [Validators.required]],
                cashId: ['', Validators.required],
                title: ['', Validators.required],
                amount: ['', Validators.required],
                status: 'Created',
                lineApproverId: [
                    this._userService.getLocalUser().lineApproverId,
                ],
                uploadedFileName: [''],
            }),
            step2: this._formBuilder.group({
                startDate: ['', Validators.required],
                endDate: ['', Validators.required],
                duration: ['', Validators.required],
                durationView: [],
            }),
        });
    }

    setMinDates() {
        const today = new Date().toISOString().slice(0, 16);
    }

    isPresentDate() {}

    getFormFieldHelpersAsString(): string {
        return this.formFieldHelpers.join(' ');
    }

    createReq(): void {
        this.showAlert = false;
        this.horizontalStepperForm.disable();
        const formData: FormData = new FormData();
        formData.append('uploadedFileName', this.file?.name);
        formData.append('uploadedFile', this.file);
        formData.append(
            'requestComments',
            this.horizontalStepperForm.value.step1.requestComments
        );
        formData.append(
            'cashId',
            this.horizontalStepperForm.value.step1.cashId
        );
        formData.append('title', this.horizontalStepperForm.value.step1.title);
        formData.append(
            'amount',
            this.horizontalStepperForm.value.step1.amount
        );
        formData.append(
            'status',
            this.horizontalStepperForm.value.step1.status
        );
        formData.append(
            'lineApproverId',
            this.horizontalStepperForm.value.step1.lineApproverId
        );
        formData.append(
            'startDate',
            this.horizontalStepperForm.value.step2.startDate
        );
        formData.append(
            'endDate',
            this.horizontalStepperForm.value.step2.endDate
        );
        formData.append(
            'duration',
            this.horizontalStepperForm.value.step2.duration
        );
        this._cashReqService.createCashReq(formData).subscribe(
            () => {
                this.horizontalStepperForm.enable();
                this._alertService.displayMessage('Cash requisition submitted');
                this._router.navigate(['axis/requsitions/cash']);
            },
            (error) => {
                console.log(error);
                this.errors = error?.error?.errors;

                if (error.errors) this.showAlert = true;
                this._alertService.displayError(
                    'Please confirm your fields and try again'
                );
                this.horizontalStepperForm.enable();
            }
        );
    }

    isInThePast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.isPastStartDate ?? date < today;
    }

    fileChange(event) {
        console.log(this.horizontalStepperForm.value.step1.RequestComments);

        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }
    }

    //create function to get time difference seconds
    getTimeDifference(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end.getTime() - start.getTime();
        return Math.round(diff / 1000);
    }
    //create function get hours and minutes from seconds
    getHoursAndMinutes(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - hours * 3600) / 60);
        return hours + ' hours ' + minutes + ' minutes';
    }

    //create function to change seconds to minutes
    getMinutes(seconds) {
        const minutes = Math.floor(seconds / 60);
        return minutes;
    }

    onDateChange() {
        this.horizontalStepperForm.patchValue({
            step2: {
                duration: this.getMinutes(
                    this.getTimeDifference(
                        this.horizontalStepperForm.value.step2.startDate,
                        this.horizontalStepperForm.value.step2.endDate
                    )
                ),
                durationView: this.getHoursAndMinutes(
                    this.getTimeDifference(
                        this.horizontalStepperForm.value.step2.startDate,
                        this.horizontalStepperForm.value.step2.endDate
                    )
                ),
            },
        });
    }
}
