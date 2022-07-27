import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/modules/admin/models/users/users.types';
import { VehicleService } from 'app/modules/admin/services/vehicles/vehicle.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { AssetRequisitionService } from 'app/modules/employee-x/services/asset-requisitions/asset-requisitions.service';
import { CardRequisitionService } from 'app/modules/employee-x/services/card-requisitions/card-requisitions.service';
import { CashRequisitionService } from 'app/modules/employee-x/services/cash-requisitions/cash-requisitions.service';
import { DeviceRequisitionService } from 'app/modules/employee-x/services/device-requisitions/device-requisitions.service';
import { VehicleRequisitionService } from 'app/modules/employee-x/services/vehicle-requisitions/vehicle-requisitions.service';
import { ApexOptions } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DepartmentService } from '../services/departments/department.service';
import { UsersService } from '../services/users/users.service';


@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.css']
})
export class AdminDashComponent implements OnInit {

  data: any;
  user: any;
  users: User[] = [];
  selectedProject: string = 'Axis Admin';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading = true;
  roles: any[] = [];
  departments: any[] = [];
  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _userService: UserService,
    private _usersService: UsersService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _alertService: AlertService,
    private _departmentService: DepartmentService
  ) {
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this.user = this._userService.getLocalUser();
    console.log(this.user);

    this.getUsers();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getUsers() {
    this._usersService.getUsers().subscribe(response => {
      console.log(response);
      this.users = response;
      this._userService.getAllRoles().subscribe(roles => {
        this.roles = roles;
        this._departmentService.getDepartments().subscribe((departments) => {
          this.departments = departments;
          this.isLoading = false;
        }, error => {
          this._alertService.displayError('Failed to fetch departments')
          this.isLoading = false;
        })
      }, error => {
        this._alertService.displayError('Failed to fetch roles')
        this.isLoading = false;
      })
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Failed to fetch users')
    });
    // this.users$ = this._usersService.users$;
  }


  navigateTo(path: string) {
    this._router.navigate([path]);
  }

}
