import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantainanceComponent } from '../admin/mantainance/mantainance.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CalendarSettingsComponent } from './calendar/settings/settings.component';

import { EmployeeDashComponent } from './employee-dash/employee-dash.component';
import { CalendarSettingsResolver } from './services/calendar/calendar.resolvers';

const routes: Routes = [
    {
        path: 'dashboard',
        component: EmployeeDashComponent,
    },
    {
        path: 'announcements',
        component: AnnouncementsComponent,
        // resolve: {
        //   announcements: AnnouncementsResolver
        // }
    },
    {
        path: 'calendar',
        children: [
            {
                path: '',
                component: MantainanceComponent,
                // resolve: {
                //   calendars: CalendarCalendarsResolver,
                //   settings: CalendarSettingsResolver,
                //   weekdays: CalendarWeekdaysResolver
                // }
            },
            {
                path: 'settings',
                component: CalendarSettingsComponent,
                resolve: {
                    settings: CalendarSettingsResolver,
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EmployeeXRoutingModule {}
