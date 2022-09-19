import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { DeviceRequisitionService } from '../../../employee-x/services/device-requisitions/device-requisitions.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { UserService } from 'app/core/user/user.service';
import { TitleService } from 'app/modules/admin/services/titles/title.service';
import { Title } from 'app/modules/admin/models/titles/title.types';
import { NotificationsService } from 'app/modules/employee-x/services/nortifications/notifications.service';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
})
export class CreateDeviceReqComponent implements OnInit {
    horizontalStepperForm: FormGroup;
    formFieldHelpers: string[] = [''];
    devices: any[];
    titles: Title[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _alertService: AlertService,
        private _formBuilder: FormBuilder,
        private _deviceReqService: DeviceRequisitionService,
        private _router: Router,
        private _titleService: TitleService,
        private _not: NotificationsService
    ) {}

    ngOnInit(): void {
        this._deviceReqService.getDevices().subscribe((data) => {
            this.devices = data;
        });

        this._titleService.getTitles().subscribe((data) => {
            this.titles = data;
        });
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                requestComments: ['', [Validators.required]],
                deviceId: ['', Validators.required],
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
        this._deviceReqService
            .createDeviceReq({
                ...this.horizontalStepperForm.value.step1,
                ...this.horizontalStepperForm.value.step2,
            })
            .subscribe(
                () => {
                    this.horizontalStepperForm.enable();
                    this._alertService.displayMessage(
                        'Device requisition submitted'
                    );
                    this._not
                        .sendSendWhatsappMessageToUser(
                            this._userService.getLocalUser()
                                .approverPhoneNumber,
                            `${this._userService.getLocalUser().approverName} ${
                                this._userService.getLocalUser().approverSurname
                            }`,
                            `${this._userService.getLocalUser().firstname} ${
                                this._userService.getLocalUser().lastname
                            }`,
                            'Cash'
                        )
                        .subscribe(() => {
                            this._router.navigate(['axis/requsitions/device']);
                        });
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
