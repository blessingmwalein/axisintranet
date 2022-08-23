import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeXRoutingModule } from './employee-x-routing.module';
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
import { DashboardComponent } from './dashboard/dashboard.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { CalendarRecurrenceComponent } from './calendar/recurrence/recurrence.component';
import { CalendarSettingsComponent } from './calendar/settings/settings.component';
import { CalendarSidebarComponent } from './calendar/sidebar/sidebar.component';
import { EmployeeDashComponent } from './employee-dash/employee-dash.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    declarations: [
        DashboardComponent,
        CalendarComponent,
        CalendarSettingsComponent,
        CalendarRecurrenceComponent,
        CalendarSidebarComponent,
        AnnouncementsComponent,
        EmployeeDashComponent,
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
        MatProgressSpinnerModule,
        PdfViewerModule,
    ],
})
export class EmployeeXModule {}
