import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { DepartmentsComponent } from './departments/departments.component';
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
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { CreateComponent } from './user-list/create/create.component';
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
import { AssetsComponent } from './assets/assets.component';
import { CreateAssetComponent } from './assets/create-asset/create-asset.component';
import { CardsComponent } from './cards/cards.component';
import { CreateCardComponent } from './cards/create-card/create-card.component';
import { CashsComponent } from './cashs/cashs.component';
import { CreateCashComponent } from './cashs/create-cash/create-cash.component';
import { DevicesComponent } from './devices/devices.component';
import { CreateDeviceComponent } from './devices/create-device/create-device.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { CreateVehicleComponent } from './vehicles/create-vehicle/create-vehicle.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-list/user-detail/user-detail.component';
import { MantainanceComponent } from './mantainance/mantainance.component';
import { AdminDashComponent } from './admin-dash/admin-dash.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CalendarComponent,
    AnnouncementsComponent,
    DepartmentsComponent,
    RolesComponent,
    PermissionsComponent,
    CreateComponent,
    CreateRoleComponent,
    CreateDepartmentComponent,
    AssetsComponent,
    CreateAssetComponent,
    CardsComponent,
    CreateCardComponent,
    CashsComponent,
    CreateCashComponent,
    DevicesComponent,
    CreateDeviceComponent,
    VehiclesComponent,
    CreateVehicleComponent,
    UserListComponent,
    UserDetailComponent,
    MantainanceComponent,
    AdminDashComponent
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
    MatCheckboxModule,
    MatDatepickerModule
  ]
})
export class AdminModule { }
