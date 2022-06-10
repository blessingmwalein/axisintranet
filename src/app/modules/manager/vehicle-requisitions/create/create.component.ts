import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { VehicleRequisitionService } from 'app/modules/employee-x/services/vehicle-requisitions/vehicle-requisitions.service';
import { UserService } from 'app/core/user/user.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  horizontalStepperForm: FormGroup;
  formFieldHelpers: string[] = [''];
  vehicles: any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _userService:UserService, private _alertService: AlertService, private _formBuilder: FormBuilder, private _vehicleReqService: VehicleRequisitionService, private _router: Router,) { }

  ngOnInit(): void {
    this._vehicleReqService.getVehicles().subscribe(data => {
      this.vehicles = data;
    })

    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        requestComments: ['', [Validators.required]],
        vehicleId: ['', Validators.required],
        title: ['', Validators.required],
        lineApproverId:[this._userService.getLocalUser().lineApproverId]
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
    this._vehicleReqService.createVehicleReq({ ...this.horizontalStepperForm.value.step1, ...this.horizontalStepperForm.value.step2 })
      .subscribe(() => {
        this.horizontalStepperForm.enable();
        this._alertService.displayMessage("Vehicle requisition submitted")
        this._router.navigate(['axis/manager/requisitions/vehicle']);
      },
        (error) => {
          console.log(error);
          this._alertService.displayError("Failed to  submitt please try again")
          this.horizontalStepperForm.enable();
        });
  }
}
