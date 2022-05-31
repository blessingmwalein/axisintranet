import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { DeviceRequisitionService } from '../../services/device-requisitions/device-requisitions.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateDeviceReqComponent implements OnInit {

  horizontalStepperForm: FormGroup;
  formFieldHelpers: string[] = [''];
  devices: any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _alertService: AlertService, private _formBuilder: FormBuilder, private _deviceReqService: DeviceRequisitionService, private _router: Router,) { }

  ngOnInit(): void {
    this._deviceReqService.getDevices().subscribe(data => {
      this.devices = data;
    })

    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        requestComments: ['', [Validators.required]],
        deviceId: ['', Validators.required],
        title: ['', Validators.required],
        amount: ['', Validators.required]
      }),
      step2: this._formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        duration: ['', Validators.required]
      }),
    });

  }

  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }


  createReq(): void {
    console.log('Clicked');

    this.horizontalStepperForm.disable();
    this._deviceReqService.createDeviceReq({ ...this.horizontalStepperForm.value.step1, ...this.horizontalStepperForm.value.step2 })
      .subscribe(() => {
        this.horizontalStepperForm.enable();
        this._alertService.displayMessage("Device requisition submitted")
        this._router.navigate(['axis/employee/requisitions/device']);
      },
        (error) => {
          console.log(error);
          this._alertService.displayError("Failed to  submitt please try again")
          this.horizontalStepperForm.enable();
        });
  }
}