import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { UserService } from 'app/core/user/user.service';
import { AssetRequisitionService } from 'app/modules/employee-x/services/asset-requisitions/asset-requisitions.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateAssetReqComponent implements OnInit {
    horizontalStepperForm: FormGroup;
    formFieldHelpers: string[] = [''];
    assets: any[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _assetReqService: AssetRequisitionService,
        private _router: Router,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this._assetReqService.getAssets().subscribe((data) => {
            this.assets = data;
        });

        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                requestComments: ['', [Validators.required]],
                assetId: ['', Validators.required],
                title: ['', Validators.required],
                amount: [''],
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
        console.log('Clicked');

        this.horizontalStepperForm.disable();
        this._assetReqService
            .createAssetReq({
                ...this.horizontalStepperForm.value.step1,
                ...this.horizontalStepperForm.value.step2,
            })
            .subscribe(
                () => {
                    this.horizontalStepperForm.enable();
                    this._alertService.displayMessage(
                        'Asset requisition submitted'
                    );
                    this._router.navigate(['axis/requsitions/asset']);
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
}
