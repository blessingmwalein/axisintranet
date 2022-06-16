import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MantainanceComponent } from '../admin/mantainance/mantainance.component';
import { AssetReqListComponent } from './asset-requisition/asset-req-list/asset-req-list.component';
import { CreateAssetReqComponent } from './asset-requisition/create/create.component';
import { AssetRequisitionDetailsComponent } from './asset-requisition/details/details.component';
import { CardReqListComponent } from './card-requisition/card-req-list/card-req-list.component';
import { CreateCardReqComponent } from './card-requisition/create/create.component';
import { CardRequisitionDetailsComponent } from './card-requisition/details/details.component';
import { CashReqListComponent } from './cash-requisition/cash-req-list/cash-req-list.component';
import { CreateCashReqComponent } from './cash-requisition/create/create.component';
import { CashRequisitionDetailsComponent } from './cash-requisition/details/details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateDeviceReqComponent } from './device-requisition/create/create.component';
import { DeviceRequisitionDetailsComponent } from './device-requisition/details/details.component';
import { DeviceReqListComponent } from './device-requisition/device-req-list/device-req-list.component';
import { CreateComponent } from './vehicle-requisitions/create/create.component';
import { VehicleRequisitionDetailsComponent } from './vehicle-requisitions/details/details.component';
import { VehicleReqListComponent } from './vehicle-requisitions/vehicle-req-list/vehicle-req-list.component';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: 'requisitions/vehicle',
    component: VehicleReqListComponent,
  },
  {
    path: 'requisitions/vehicle/create',
    component: CreateComponent,
  },
  {
    path: 'requisitions/vehicle/:id',
    component: VehicleRequisitionDetailsComponent,
  },

  //cash
  {
    path: 'requisitions/cash',
    component: CashReqListComponent,
  },
  {
    path: 'requisitions/cash/create',
    component: CreateCashReqComponent,
  },
  {
    path: 'requisitions/cash/:id',
    component: CashRequisitionDetailsComponent,
  },

  //card
  {
    path: 'requisitions/card',
    component: CardReqListComponent,
  },
  {
    path: 'requisitions/card/create',
    component: CreateCardReqComponent,
  },
  {
    path: 'requisitions/card/:id',
    component: CardRequisitionDetailsComponent,
  },

  ////card
  {
    path: 'requisitions/device',
    component: DeviceReqListComponent,
  },
  {
    path: 'requisitions/device/create',
    component: CreateDeviceReqComponent,
  },
  {
    path: 'requisitions/device/:id',
    component: DeviceRequisitionDetailsComponent,
  },
  //asset
  {
    path: 'requisitions/asset',
    component: AssetReqListComponent,
  },
  {
    path: 'requisitions/asset/create',
    component: CreateAssetReqComponent,
  },
  {
    path: 'requisitions/asset/:id',
    component: AssetRequisitionDetailsComponent,
  },
  {
    path: 'announcements',
    component: MantainanceComponent,
  },
  {
    path: 'calendar',
    component: MantainanceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
