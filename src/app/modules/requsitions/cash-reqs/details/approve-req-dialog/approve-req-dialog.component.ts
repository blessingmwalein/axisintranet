import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { CreateDepartmentComponent } from 'app/modules/admin/departments/create-department/create-department.component';
import { DepartmentService } from 'app/modules/admin/services/departments/department.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';

@Component({
  selector: 'app-approve-req-dialog',
  templateUrl: './approve-req-dialog.component.html',
  styleUrls: ['./approve-req-dialog.component.scss']
})
export class ApproveReqDialogComponent implements OnInit {

  approveForm: FormGroup;
  @Output() submitClicked = new EventEmitter<any>();
  
  constructor(
    public matDialogRef: MatDialogRef<CreateDepartmentComponent>,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _alertService: AlertService,
    private _departmentService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.approveForm = this._formBuilder.group({
      comment: ['', [Validators.required]],
    });
  }

  submit() {
    this.submitClicked.emit({
      comment: this.approveForm.get('comment').value,
      value:'confirmed'
    });
    this.matDialogRef.close();

  }
  close() {
    this.matDialogRef.close();
  }
}
