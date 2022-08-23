import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { UserService } from 'app/core/user/user.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';

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
            }),
        });
    }

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
                this._alertService.displayError(
                    'Check your fields and try again'
                );
                this.horizontalStepperForm.enable();
            }
        );
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.file = fileList[0];
        }
    }
}
