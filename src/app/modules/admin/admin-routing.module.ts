import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentsComponent } from './departments/departments.component';
import { PermissionsComponent } from './Permissions/Permissions.component';
import { RolesComponent } from './roles/roles.component';
import { CanDeactivateUsersDetails } from './services/users/users.guards';
import { UsersDepartmentsResolver, UsersResolver, UsersTagsResolver, UsersUserResolver } from './services/users/users.resolvers';
import { UsersDetailsComponent } from './users/details/details.component';
import { UsersListComponent } from './users/list/list.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'calendar',
    children: [
      {
        path: '',
        component: CalendarComponent,
      },
      // {
      //   path: 'settings',
      //   component: CalendarSettingsComponent,
      // },

    ]
  },
  {
    path: 'announcements',
    component: AnnouncementsComponent
  },
  {
    path: 'departments',
    component: DepartmentsComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    resolve: {
      tags: UsersTagsResolver
    },
    children: [
      {
        path: '',
        component: UsersListComponent,
        resolve: {
          tasks: UsersResolver,
          departments: UsersDepartmentsResolver
        },
        children: [
          {
            path: ':id',
            component: UsersDetailsComponent,
            resolve: {
              task: UsersUserResolver,
              departments: UsersDepartmentsResolver
            },
            canDeactivate: [CanDeactivateUsersDetails]
          }
        ]
      }
    ]
  },
  {
    path: 'security',
    children: [
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'permissions',
        component: PermissionsComponent
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
