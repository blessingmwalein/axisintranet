import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { VehicleRequisition } from '../../models/vehicle-requisitions/vehicle-requisitions.types';
import { VehicleRequisitionService } from '../../services/vehicle-requisitions/vehicle-requisitions.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';


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

  constructor(private _formBuilder: FormBuilder, private _vehicleReqService: VehicleRequisitionService, private _router: Router,) { }

  ngOnInit(): void {
    this._vehicleReqService.getVehicles().subscribe(data => {
      this.vehicles = data;
    })

    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        requestComments: ['', [Validators.required]],
        vehicleId: ['', Validators.required],
      }),
      step2: this._formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      }),
    });

    this._vehicleReqService.vehicleRequisitions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((vehicleRequisitions: VehicleRequisition[]) => {
      });
  }

  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }


  createReq(): void {
    console.log('Clicked');

    this.horizontalStepperForm.disable();

    // setTimeout(() => {
    //   this._router.navigate(['axis/employee/requisitions/vehicle']);
    // }, 3000);
     
    
    this._vehicleReqService.createRequ({...this.horizontalStepperForm.value.step1 , ...this.horizontalStepperForm.value.step2})
        .subscribe(() => {
          this._router.navigate(['axis/employee/requisitions/vehicle']);
      },
      (error) => {
          console.log(error);
          // Re-enable the form
          this.horizontalStepperForm.enable();
      });
  }
}
