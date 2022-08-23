import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequsitionsRoutingModule } from './requsitions-routing.module';
import { CreateCashReqComponent } from './cash-reqs/create-cash-req/create-cash-req.component';
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
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CashReqListComponent } from './cash-reqs/cash-req-list/cash-req-list.component';
import { UpdateReceivedFundsComponent } from './cash-reqs/update-received-funds/update-received-funds.component';
import { UpdateUsedFundsComponent } from './cash-reqs/update-used-funds/update-used-funds.component';

import { UpdateReceivedFundsComponent as UpdateReceivedFundsComponentCard } from './cards-reqs/update-received-funds/update-received-funds.component';
import { UpdateUsedFundsComponent as UpdateUsedFundsComponentCard } from './cards-reqs/update-used-funds/update-used-funds.component';
import { PreviewFileComponent } from './cash-reqs/preview-file/preview-file.component';
import { PrintReqPrevComponent as PreviewFileComponentCard } from './cards-reqs/print-req-prev/print-req-prev.component';
import { CashRequisitionDetailsComponent } from './cash-reqs/details/details.component';
import { CreateCardReqComponent } from './cards-reqs/create/create.component';
import { CardReqListComponent } from './cards-reqs/card-req-list/card-req-list.component';
import { CardRequisitionDetailsComponent } from './cards-reqs/details/details.component';
import { CreateDeviceReqComponent } from './device-reqs/create/create.component';
import { DeviceRequisitionDetailsComponent } from './device-reqs/details/details.component';
import { DeviceReqListComponent } from './device-reqs/device-req-list/device-req-list.component';
import { CreateVehicleReqComponent } from './vehicle-reqs/create/create.component';
import { VehicleReqListComponent } from './vehicle-reqs/vehicle-req-list/vehicle-req-list.component';
import { VehicleRequisitionDetailsComponent } from './vehicle-reqs/details/details.component';
import { CreateAssetReqComponent } from './assets-reqs/create/create.component';
import { AssetReqListComponent } from './assets-reqs/asset-req-list/asset-req-list.component';
import { AssetRequisitionDetailsComponent } from './assets-reqs/details/details.component';
import { UpdateReleasedFundsComponent } from './cash-reqs/update-released-funds/update-released-funds.component';
import { PrintReqPrevComponent } from './cash-reqs/print-req-prev/print-req-prev.component';
import { UpdateReleasedFundsComponent as UpdateReleasedFundsComponentCard } from './cards-reqs/update-released-funds/update-released-funds.component';
import { PrintReqPrevComponent as PrintReqPrevComponentDevice } from './device-reqs/print-req-prev/print-req-prev.component';
import { PrintReqPrevComponent as PrintReqPrevComponentVehicle } from './vehicle-reqs/print-req-prev/print-req-prev.component';
import {PrintReqPrevComponent as PrintReqPrevComponentAsset} from './assets-reqs/print-req-prev/print-req-prev.component';
@NgModule({
    declarations: [
        CreateCashReqComponent,
        CashReqListComponent,
        UpdateReceivedFundsComponent,
        UpdateUsedFundsComponent,
        UpdateReceivedFundsComponentCard,
        UpdateUsedFundsComponentCard,
        UpdateReleasedFundsComponent,
        PreviewFileComponent,
        PrintReqPrevComponentDevice,
        PreviewFileComponentCard,
        UpdateReleasedFundsComponentCard,
        CashRequisitionDetailsComponent,
        CreateCardReqComponent,
        CardReqListComponent,
        CardRequisitionDetailsComponent,
        CreateDeviceReqComponent,
        DeviceRequisitionDetailsComponent,
        DeviceReqListComponent,
        CreateVehicleReqComponent,
        VehicleReqListComponent,
        VehicleRequisitionDetailsComponent,
        CreateAssetReqComponent,
        AssetReqListComponent,
        AssetRequisitionDetailsComponent,
        PrintReqPrevComponent,
        PrintReqPrevComponentVehicle,
        PrintReqPrevComponentAsset
    ],
    imports: [
        CommonModule,
        RequsitionsRoutingModule,
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
export class RequsitionsModule {}
