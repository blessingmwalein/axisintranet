import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {

  members: any[];
  roles: any[];

  /**
   * Constructor
   */
  constructor() {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Setup the team members
    this.members = [
      {
        avatar: 'assets/images/avatars/blessing-mwale.webp',
        name: 'Blessing Mwale',
        email: 'bmwale@axissol.com',
        role: 'admin'
      },
      {
        avatar: 'assets/images/avatars/blessing-mwale.webp',
        name: 'Rabington Chitima',
        email: 'rchitima@axissol.come',
        role: 'admin'
      },
      {
        avatar: 'assets/images/avatars/blessing-mwale.webp',
        name: 'Simbarashe Start',
        email: 'simbarashestart@axissol.com',
        role: 'write'
      },
      {
        avatar: 'assets/images/avatars/blessing-mwale.webp',
        name: 'Philip Kent',
        email: 'pkent@axissol.com',
        role: 'read'
      },
    ];

    // Setup the roles
    this.roles = [
      {
        label: 'Read',
        value: 'read',
        description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
      },
      {
        label: 'Write',
        value: 'write',
        description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.'
      },
      {
        label: 'Admin',
        value: 'admin',
        description: 'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.'
      }
    ];
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
