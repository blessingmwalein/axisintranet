import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { DepartmentsComponent } from './departments/departments.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './Permissions/Permissions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { UsersListComponent } from './users/list/list.component';
import { UsersDetailsComponent } from './users/details/details.component';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { CreateComponent } from './users/create/create.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CreateRoleComponent } from './roles/create-role/create-role.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateDepartmentComponent } from './departments/create-department/create-department.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    DashboardComponent,
    CalendarComponent,
    AnnouncementsComponent,
    DepartmentsComponent,
    UsersComponent,
    RolesComponent,
    PermissionsComponent,
    UsersListComponent,
    UsersDetailsComponent,
    CreateComponent,
    CreateRoleComponent,
    CreateDepartmentComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    FuseAlertModule,
    SharedModule,
    FuseFindByKeyPipeModule,
    MatStepperModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatCheckboxModule
  ]
})
export class AdminModule { }
