import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarSettingsComponent } from './calendar/settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnnouncementsResolver } from './services/announcements/announcements.resolvers';
import { CalendarCalendarsResolver, CalendarSettingsResolver, CalendarWeekdaysResolver } from './services/calendar/calendar.resolvers';
import { AcademyCategoriesResolver, VehicleRequisitionResolver, VehicleRequisitionsResolver } from './services/vehicle-requisitions/vehicle-requisitions.resolvers';
import { VehicleRequisitionDetailsComponent } from './vehicle-requisitions/details/details.component';
import { VehicleRequisitionListComponent } from './vehicle-requisitions/list/list.component';
import { VehicleRequisitionsComponent } from './vehicle-requisitions/vehicle-requisitions.component';

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
        path: ':id',
        component: VehicleRequisitionDetailsComponent,
        resolve: {
          course: VehicleRequisitionResolver
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
