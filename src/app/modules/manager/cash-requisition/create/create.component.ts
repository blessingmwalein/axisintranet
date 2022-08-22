import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { UserService } from 'app/core/user/user.service';
import moment from 'moment';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateCashReqComponent implements OnInit {

    horizontalStepperForm: FormGroup;
    formFieldHelpers: string[] = [''];
    cashs: any[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    minDate = new Date();
    isPastStartDate = false;
    file: File;
    constructor(private _alertService: AlertService, private _formBuilder: FormBuilder, private _cashReqService: CashRequisitionService, private _router: Router, private _userService: UserService) { }


    ngOnInit(): void {
      // const currentYear = moment().year();
      // this.minDate = moment([currentYear - 1, 0, 1]);
      // this.maxDate = moment([currentYear + 1, 11, 31]);
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
          lineApproverId: [this._userService.getLocalUser().lineApproverId],
          uploadedFileName: ['']
        }),
        step2: this._formBuilder.group({
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
          duration: ['', Validators.required]
        }),
      });

    }

    setMinDates() {
      const today = new Date().toISOString().slice(0, 16);
      // document.getElementById("startDate").setAttribute("min", today);
    }

    isPresentDate() {

    }

    getFormFieldHelpersAsString(): string {
      return this.formFieldHelpers.join(' ');
    }


    createReq(): void {
      console.log('Clicked');
      this.horizontalStepperForm.patchValue({

      });
      this.horizontalStepperForm.disable();
      const formData: FormData = new FormData();
      formData.append('uploadedFileName', this.file.name);
      formData.append('uploadedFile', this.file);
      formData.append('requestComments', this.horizontalStepperForm.value.step1.requestComments);
      formData.append('cashId', this.horizontalStepperForm.value.step1.cashId);
      formData.append('title', this.horizontalStepperForm.value.step1.title);
      formData.append('amount', this.horizontalStepperForm.value.step1.amount);
      formData.append('status', this.horizontalStepperForm.value.step1.status);
      formData.append('lineApproverId', this.horizontalStepperForm.value.step1.lineApproverId);
      formData.append('startDate', this.horizontalStepperForm.value.step2.startDate);
      formData.append('endDate', this.horizontalStepperForm.value.step2.endDate);
      formData.append('duration', this.horizontalStepperForm.value.step2.duration);

      // formData.append('UploadedFileName', file, file.name);
      // let headers = new Headers();
      /** In Angular 5, including the header Content-Type can invalidate your request */
      // headers.append('Content-Type', 'multipart/form-data');
      // headers.append('Accept', 'application/json');

      this._cashReqService.createCashReq(formData)
        .subscribe(() => {
          this.horizontalStepperForm.enable();
          this._alertService.displayMessage('Cash requisition submitted');
          this._router.navigate(['axis/employee/requisitions/cash']);
        },
          (error) => {
            console.log(error);
            this._alertService.displayError('Failed to  submitt please try again');
            this.horizontalStepperForm.enable();
          });
    }

    isInThePast(date) {
      const today = new Date();

      // 👇️ OPTIONAL!
      // This line sets the hour of the current date to midnight
      // so the comparison only returns `true` if the passed in date
      // is at least yesterday
      today.setHours(0, 0, 0, 0);
      this.isPastStartDate ?? date < today;
      // return date < today;
    }

    fileChange(event) {
      console.log(this.horizontalStepperForm.value.step1.RequestComments);

      const fileList: FileList = event.target.files;
      if (fileList.length > 0) {
        this.file = fileList[0];
      }
    }
}
