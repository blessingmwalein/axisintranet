import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { ApexOptions } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../models/users/users.types';
import { DepartmentService } from '../services/departments/department.service';
import { UsersService } from '../services/users/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  data: any;
  user: User;
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

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
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
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }


}
