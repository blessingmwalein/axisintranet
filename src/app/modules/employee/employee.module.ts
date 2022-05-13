import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarSettingsComponent } from './calendar/settings/settings.component';
import { CalendarRecurrenceComponent } from './calendar/recurrence/recurrence.component';
import { CalendarSidebarComponent } from './calendar/sidebar/sidebar.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FuseDateRangeModule } from '@fuse/components/date-range';
import { MatRadioModule } from '@angular/material/radio';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { VehicleRequisitionsComponent } from './vehicle-requisitions/vehicle-requisitions.component';
import { VehicleRequisitionDetailsComponent } from './vehicle-requisitions/details/details.component';
import { VehicleRequisitionListComponent } from './vehicle-requisitions/list/list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CalendarComponent,
    CalendarSettingsComponent,
    CalendarRecurrenceComponent,
    CalendarSidebarComponent,
    AnnouncementsComponent,
    VehicleRequisitionsComponent,
    VehicleRequisitionDetailsComponent,
    VehicleRequisitionListComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
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
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY'
        },
        display: {
          dateInput: 'DD.MM.YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'DD.MM.YYYY',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class EmployeeModule { }
