import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';
import { Subject } from 'rxjs';

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
    file: File;
    constructor(
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _cashReqService: CashRequisitionService,
        private _router: Router,
        private _userService: UserService
    ) {}

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
        this.horizontalStepperForm.disable();
        const formData: FormData = new FormData();
        formData.append('uploadedFileName', this.file.name);
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
                this._router.navigate(['../requisitions/cash']);
            },
            (error) => {
                console.log(error);
                this._alertService.displayError(
                    'Failed to  submitt please try again'
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
}
