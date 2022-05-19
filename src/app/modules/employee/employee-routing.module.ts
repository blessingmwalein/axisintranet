import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarSettingsComponent } from './calendar/settings/settings.component';
import { CashRequisitionComponent } from './cash-requisition/cash-requisition.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnnouncementsResolver } from './services/announcements/announcements.resolvers';
import { CalendarCalendarsResolver, CalendarSettingsResolver, CalendarWeekdaysResolver } from './services/calendar/calendar.resolvers';
import { AcademyCategoriesResolver, VehicleRequisitionResolver, VehicleRequisitionsResolver } from './services/vehicle-requisitions/vehicle-requisitions.resolvers';

import { AcademyCategoriesResolver as CashAcademyCategoriesResolver , CashRequisitionResolver, CashRequisitionsResolver } from './services/cash-requisitions/cash-requisitions.resolvers';

import { CreateComponent } from './vehicle-requisitions/create/create.component';
import { VehicleRequisitionDetailsComponent } from './vehicle-requisitions/details/details.component';
import { VehicleRequisitionListComponent } from './vehicle-requisitions/list/list.component';
import { VehicleRequisitionsComponent } from './vehicle-requisitions/vehicle-requisitions.component';
import { CashRequisitionListComponent } from './cash-requisition/list/list.component';
import { CreateCashComponent } from './cash-requisition/create/create.component';
import { CashRequisitionDetailsComponent } from './cash-requisition/details/details.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'announcements',
    component: AnnouncementsComponent,
    resolve: {
      announcements: AnnouncementsResolver
    }
  },
  {
    path: 'calendar',
    children: [
      {
        path: '',
        component: CalendarComponent,
        resolve: {
          calendars: CalendarCalendarsResolver,
          settings: CalendarSettingsResolver,
          weekdays: CalendarWeekdaysResolver
        }
      },
      {
        path: 'settings',
        component: CalendarSettingsComponent,
        resolve: {
          settings: CalendarSettingsResolver
        }
      },

    ]
  },
  {
    path: 'requisitions/vehicle',
    component: VehicleRequisitionsComponent,
    resolve: {
      categories: AcademyCategoriesResolver
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: VehicleRequisitionListComponent,
        resolve: {
          courses: VehicleRequisitionsResolver
        }
      },
      {
        path: 'create',
        pathMatch: 'full',
        component: CreateComponent,
      },
      {
        path: ':id',
        component: VehicleRequisitionDetailsComponent,
        resolve: {
          course: VehicleRequisitionResolver
        }
      }
    ]
  },
  {
    path: 'requisitions/cash',
    component: CashRequisitionComponent,
    resolve: {
      categories: CashAcademyCategoriesResolver
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CashRequisitionListComponent,
        resolve: {
          courses: CashRequisitionsResolver
        }
      },
      {
        path: 'create',
        pathMatch: 'full',
        component: CreateCashComponent,
      },
      {
        path: ':id',
        component: CashRequisitionDetailsComponent,
        resolve: {
          course: CashRequisitionResolver
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
