import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantainanceComponent } from '../admin/mantainance/mantainance.component';
import { AnnouncementsComponent } from './announcements/announcements.component';

import { DashboardComponent } from './dashboard/dashboard.component';

import { ManagerDashComponent } from './manager-dash/manager-dash.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: ManagerDashComponent,
    },
    {
        path: 'announcements',
        component: AnnouncementsComponent,
    },

    {
        path: 'announcements',
        component: MantainanceComponent,
    },
    {
        path: 'calendar',
        component: MantainanceComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GeneralManagerRoutingModule {}
