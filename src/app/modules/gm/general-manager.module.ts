import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetReqListComponent } from './asset-requisition/asset-req-list/asset-req-list.component';
import { AssetRequisitionComponent } from './asset-requisition/asset-requisition.component';
import { CreateAssetReqComponent } from './asset-requisition/create/create.component';
import { AssetRequisitionDetailsComponent } from './asset-requisition/details/details.component';
import { CardReqListComponent } from './card-requisition/card-req-list/card-req-list.component';
import { CardRequisitionComponent } from './card-requisition/card-requisition.component';
import { CreateCardReqComponent } from './card-requisition/create/create.component';
import { CardRequisitionDetailsComponent } from './card-requisition/details/details.component';
import { CashReqListComponent } from './cash-requisition/cash-req-list/cash-req-list.component';
import { CashRequisitionComponent } from './cash-requisition/cash-requisition.component';
import { CreateCashReqComponent } from './cash-requisition/create/create.component';
import { CashRequisitionDetailsComponent } from './cash-requisition/details/details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateDeviceReqComponent } from './device-requisition/create/create.component';
import { DeviceRequisitionDetailsComponent } from './device-requisition/details/details.component';
import { DeviceReqListComponent } from './device-requisition/device-req-list/device-req-list.component';
import { DeviceRequisitionComponent } from './device-requisition/device-requisition.component';
import { ApproveReqComponent } from './vehicle-requisitions/approve-req/approve-req.component';
import { CreateComponent } from './vehicle-requisitions/create/create.component';
import { VehicleRequisitionDetailsComponent } from './vehicle-requisitions/details/details.component';
import { VehicleReqListComponent } from './vehicle-requisitions/vehicle-req-list/vehicle-req-list.component';
import { VehicleRequisitionsComponent } from './vehicle-requisitions/vehicle-requisitions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
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
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { ManagerDashComponent } from './manager-dash/manager-dash.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { PrintReqPrevComponent } from './asset-requisition/print-req-prev/print-req-prev.component';
import { PrintReqPrevComponent as PrintReqPrevCardComponent  } from './card-requisition/print-req-prev/print-req-prev.component';
import { PrintReqPrevComponent as PrintReqPrevCashComponent  } from './cash-requisition/print-req-prev/print-req-prev.component';
import { PrintReqPrevComponent as PrintReqPrevDeviceComponent  } from './device-requisition/print-req-prev/print-req-prev.component';
import { PrintReqPrevComponent as PrintReqPrevVehilceComponent  } from './vehicle-requisitions/print-req-prev/print-req-prev.component';
import { GeneralManagerRoutingModule } from './general-manager-routing.module';


@NgModule({
  declarations: [
    DashboardComponent,
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
    VehicleRequisitionDetailsComponent,
    VehicleRequisitionsComponent,
    VehicleReqListComponent,
    VehicleRequisitionDetailsComponent,
    CreateComponent,
    ApproveReqComponent,
    AssetRequisitionComponent,
    AssetReqListComponent,
    CreateAssetReqComponent,
    AssetRequisitionDetailsComponent,
    ManagerDashComponent,
    AnnouncementsComponent,
    PrintReqPrevComponent,
    PrintReqPrevCardComponent,
    PrintReqPrevCashComponent,
    PrintReqPrevDeviceComponent,
    PrintReqPrevVehilceComponent
  ],
  imports: [
    CommonModule,
    GeneralManagerRoutingModule,
    MatIconModule,
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
export class GeneralManagerModule { }