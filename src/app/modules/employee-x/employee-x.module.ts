import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeXRoutingModule } from './employee-x-routing.module';
import { VehicleReqListComponent } from './vehicle-requisitions/vehicle-req-list/vehicle-req-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseDateRangeModule } from '@fuse/components/date-range';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CreateComponent } from './vehicle-requisitions/create/create.component';
import { VehicleRequisitionDetailsComponent } from './vehicle-requisitions/details/details.component';
import { VehicleRequisitionsComponent } from './vehicle-requisitions/vehicle-requisitions.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CashRequisitionComponent } from './cash-requisition/cash-requisition.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CalendarRecurrenceComponent } from './calendar/recurrence/recurrence.component';
import { CalendarSettingsComponent } from './calendar/settings/settings.component';
import { CalendarSidebarComponent } from './calendar/sidebar/sidebar.component';
import { CashRequisitionDetailsComponent } from './cash-requisition/details/details.component';
import { CashReqListComponent } from './cash-requisition/cash-req-list/cash-req-list.component';
import { CreateCashReqComponent } from './cash-requisition/create/create.component';
import { CardRequisitionComponent } from './card-requisition/card-requisition.component';
import { CardReqListComponent } from './card-requisition/card-req-list/card-req-list.component';
import { CardRequisitionDetailsComponent } from './card-requisition/details/details.component';
import { CreateCardReqComponent } from './card-requisition/create/create.component';
import { DeviceRequisitionComponent } from './device-requisition/device-requisition.component';
import { DeviceReqListComponent } from './device-requisition/device-req-list/device-req-list.component';
import { CreateDeviceReqComponent } from './device-requisition/create/create.component';
import { DeviceRequisitionDetailsComponent } from './device-requisition/details/details.component';
import { AssetReqListComponent } from './asset-requisition/asset-req-list/asset-req-list.component';
import { AssetRequisitionComponent } from './asset-requisition/asset-requisition.component';
import { CreateAssetReqComponent } from './asset-requisition/create/create.component';
import { AssetRequisitionDetailsComponent } from './asset-requisition/details/details.component';
import { EmployeeDashComponent } from './employee-dash/employee-dash.component';
import { UpdateReceivedFundsComponent } from './cash-requisition/update-received-funds/update-received-funds.component';
import { UpdateUsedFundsComponent } from './cash-requisition/update-used-funds/update-used-funds.component';

import { UpdateReceivedFundsComponent as UpdateReceivedFundsComponentCard } from './card-requisition/update-received-funds/update-received-funds.component';
import { UpdateUsedFundsComponent as UpdateUsedFundsComponentCard } from './card-requisition/update-used-funds/update-used-funds.component';

@NgModule({
  declarations: [
    UpdateReceivedFundsComponentCard,
    UpdateUsedFundsComponentCard,
    VehicleReqListComponent,
    CreateComponent,
    VehicleRequisitionDetailsComponent,
    VehicleRequisitionsComponent,
    DashboardComponent,
    CalendarComponent,
    CalendarSettingsComponent,
    CalendarRecurrenceComponent,
    CalendarSidebarComponent,
    AnnouncementsComponent,
    CashRequisitionComponent,
    CashRequisitionDetailsComponent,
    CashReqListComponent,
    CreateCashReqComponent,
    CardRequisitionComponent,
    CardReqListComponent,
    CardRequisitionDetailsComponent,
    CreateCardReqComponent,
    DeviceRequisitionComponent,
    DeviceReqListComponent,
    CreateDeviceReqComponent,
    DeviceRequisitionDetailsComponent,
    AssetRequisitionComponent,
    AssetReqListComponent,
    CreateAssetReqComponent,
    AssetRequisitionDetailsComponent,
    EmployeeDashComponent,
    UpdateUsedFundsComponent,
    UpdateReceivedFundsComponent

  ],
  imports: [
    CommonModule,
    EmployeeXRoutingModule,
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    NgApexchartsModule,
    TranslocoModule,
    SharedModule,
    ScrollingModule,
    DragDropModule,
    MatAutocompleteModule,
    FuseFindByKeyPipeModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatMomentDateModule,
    MatRadioModule,
    FullCalendarModule,
    FuseDateRangeModule,
    MatStepperModule,
    FuseAlertModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ]
})
export class EmployeeXModule { }
