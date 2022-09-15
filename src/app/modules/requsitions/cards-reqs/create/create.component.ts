import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { UserService } from 'app/core/user/user.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateCardReqComponent implements OnInit {
    horizontalStepperForm: FormGroup;
    formFieldHelpers: string[] = [''];
    cards: any[];
    file: File;
    errors = [];
    startDateMin = new Date().toISOString().split('T')[0] + 'T00:00:00';
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: 'Somthing went Wrong',
    };
    showAlert: boolean = false;

    @ViewChild('endDate') endDate: ElementRef;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _cardReqService: CardRequisitionService,
        private _router: Router,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this._cardReqService.getCards().subscribe((data) => {
            this.cards = data;
        });

        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                requestComments: ['', [Validators.required]],
                cardId: ['', Validators.required],
                title: ['', Validators.required],
                amount: ['', Validators.required],
                status: ['Created'],
                lineApproverId: [
                    this._userService.getLocalUser().lineApproverId,
                ],
            }),
            step2: this._formBuilder.group({
                startDate: ['', Validators.required],
                endDate: ['', Validators.required],
                duration: ['', Validators.required],
                durationView: [],
            }),
        });

        console.log();
    }

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
            'cardId',
            this.horizontalStepperForm.value.step1.cardId
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
        // formData.append('endDate', this.horizontalStepperForm.value.step2.endDate);
        formData.append(
            'duration',
            this.horizontalStepperForm.value.step2.duration
        );
        this._cardReqService.createCardReq(formData).subscribe(
            () => {
                this.horizontalStepperForm.enable();
                this._alertService.displayMessage('Card requisition submitted');
                this._router.navigate(['axis/requsitions/card']);
            },
            (error) => {
                console.log(error);
                this.errors = error?.error?.errors;
                this.showAlert = true;
                this._alertService.displayError(
                    'Check your fields and try again'
                );
                this.horizontalStepperForm.enable();
            }
        );
    }

    numberOnly(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    //check function to set min date value to be accpeted on start date select
    checkStartDate(event) {
        console.log(event.target.value);
    }

    fileChange(event) {
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

    onDateChange(event) {
        console.log(event.target.value);
        let timeZone = event.target.value;

        //add 30 minutes to time zone
        timeZone = new Date(timeZone).getTime() + 30 * 60000;
        // console.log(new timeZone());

        this.endDate.nativeElement.min = new Date(timeZone).toISOString();

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
