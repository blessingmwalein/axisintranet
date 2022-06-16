import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { User, Department, Tag } from 'app/modules/admin/models/users/users.types';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'app/modules/alert/snackbar/alert.service';
import { UsersService } from '../services/users/users.service';
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  users$: Observable<User[]>;
  users: User[];
  isLoading = true;
  usersCount: number = 0;
  usersTableColumns: string[] = ['firstName', 'email', 'userName', 'lastName'];
  departments: Department[];
  drawerMode: 'side' | 'over';
  searchInputControl: FormControl = new FormControl();
  selectedUser: User;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _usersService: UsersService,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _alertService: AlertService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the users
    this.getUsers();
    // Get the user
    this._usersService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {

        // Update the selected user
        this.selectedUser = user;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });


    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap(query =>

          // Search
          this._usersService.searchUsers(query)
        )
      )
      .subscribe();

    // Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        // Remove the selected user when drawer closed
        this.selectedUser = null;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {

        // Set the drawerMode if the given breakpoint is active
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
        }
        else {
          this.drawerMode = 'over';
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    // Listen for shortcuts
    fromEvent(this._document, 'keydown')
      .pipe(
        takeUntil(this._unsubscribeAll),
        filter<KeyboardEvent>(event =>
          (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
          && (event.key === '/') // '/'
        )
      )
      .subscribe(() => {
        this.createUser();
      });
  }

  getUsers() {
    this._usersService.getUsers().subscribe(response => {
      console.log(response);
      this.users = response;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this._alertService.displayError('Failed to fetch users')
    });
    // this.users$ = this._usersService.users$;
  }

  navigateUsrDetail(id) {
    this._router.navigate(['./', id], { relativeTo: this._activatedRoute });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On backdrop clicked
   */
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Create user
   */
  createUser(): void {
    // Create the user
    this._usersService.createUser().subscribe((newUser) => {

      // Go to the new user
      this._router.navigate(['./', newUser.id], { relativeTo: this._activatedRoute });
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  openCreateUserDialog(): void {
    // Open the dialog
    const dialogRef = this._matDialog.open(CreateComponent, {
      data: { isEdit: false },
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
        // this();
        this.getUsers();
      });
  }

}
