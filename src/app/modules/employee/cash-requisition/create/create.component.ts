import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { CashRequisition } from '../../models/cash-requisitions/cash-requisitions.types';
import { CashRequisitionService } from '../../services/cash-requisitions/cash-requisitions.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';


@Component({
  selector: 'cash-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateCashComponent implements OnInit {

  horizontalStepperForm: FormGroup;
  formFieldHelpers: string[] = [''];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _formBuilder: FormBuilder, private _cashReqService: CashRequisitionService, private _router: Router,) { }

  ngOnInit(): void {
    this.horizontalStepperForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        id: [''],
        description: ['', [Validators.required]],
        duration: ['', Validators.required],
        amount: ['', Validators.required],
      }),
      step2: this._formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      }),
    });

    this._cashReqService.cashRequisitions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cashRequisitions: CashRequisition[]) => {
      });
  }

  getFormFieldHelpersAsString(): string {
    return this.formFieldHelpers.join(' ');
  }


  createReq(): void {
    console.log('Clicked');

    this.horizontalStepperForm.disable();

    setTimeout(() => {
      this._router.navigate(['axis/employee/requisitions/cash']);
    }, 3000);
    // this._cashReqService.createRequ({...this.horizontalStepperForm.value.step1 , ...this.horizontalStepperForm.value.step2})
    //     .subscribe(() => {
    //       this._router.navigate(['axis/employee/requisitions/cash']);
    //   },
    //   (response) => {
    //       console.log(response);

    //       // Re-enable the form
    //       this.horizontalStepperForm.enable();
    //   });
  }
}
