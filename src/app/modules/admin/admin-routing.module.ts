import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AssetsComponent } from './assets/assets.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CardsComponent } from './cards/cards.component';
import { CashsComponent } from './cashs/cashs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DevicesComponent } from './devices/devices.component';
import { PermissionsComponent } from './Permissions/Permissions.component';
import { RolesComponent } from './roles/roles.component';
import { UserListComponent } from './user-list/user-list.component';
import { CreateComponent } from './user-list/create/create.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { UserDetailComponent } from './user-list/user-detail/user-detail.component';
import { MantainanceComponent } from './mantainance/mantainance.component';

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
    path: 'requisitions-items/asset',
    component: AssetsComponent
  },
  {
    path: 'requisitions-items/card',
    component: CardsComponent
  },
  {
    path: 'requisitions-items/cash',
    component: CashsComponent
  },
  {
    path: 'requisitions-items/device',
    component: DevicesComponent
  },
  {
    path: 'requisitions-items/vehicle',
    component: VehiclesComponent
  },
  {
    path: 'create/user',
    component: CreateComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent
  },
  // {
  //   path: 'users',
  //   component: UsersComponent,
  //   resolve: {
  //     tags: UsersTagsResolver
  //   },
  //   children: [
  //     {
  //       path: '',
  //       component: UserListComponent,
  //       children: [
  //         {
  //           path: ':id',
  //           component: UsersDetailsComponent,
  //           resolve: {
  //             task: UsersUserResolver,
  //             departments: UsersDepartmentsResolver
  //           },
  //           canDeactivate: [CanDeactivateUsersDetails]
  //         }
  //       ]
  //     },

  //   ]
  // },
  {
    path: 'security',
    children: [
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'permissions',
        component: MantainanceComponent
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
