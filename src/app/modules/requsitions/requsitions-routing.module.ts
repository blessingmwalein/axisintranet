import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetReqListComponent } from './assets-reqs/asset-req-list/asset-req-list.component';
import { CreateAssetReqComponent } from './assets-reqs/create/create.component';
import { AssetRequisitionDetailsComponent } from './assets-reqs/details/details.component';
import { CardReqListComponent } from './cards-reqs/card-req-list/card-req-list.component';
import { CreateCardReqComponent } from './cards-reqs/create/create.component';
import { CardRequisitionDetailsComponent } from './cards-reqs/details/details.component';
import { CashReqListComponent } from './cash-reqs/cash-req-list/cash-req-list.component';
import { CreateCashReqComponent } from './cash-reqs/create-cash-req/create-cash-req.component';
import { CashRequisitionDetailsComponent } from './cash-reqs/details/details.component';
import { CreateDeviceReqComponent } from './device-reqs/create/create.component';
import { DeviceRequisitionDetailsComponent } from './device-reqs/details/details.component';
import { DeviceReqListComponent } from './device-reqs/device-req-list/device-req-list.component';
import { CreateVehicleReqComponent } from './vehicle-reqs/create/create.component';
import { VehicleRequisitionDetailsComponent } from './vehicle-reqs/details/details.component';
import { VehicleReqListComponent } from './vehicle-reqs/vehicle-req-list/vehicle-req-list.component';

const routes: Routes = [
    {
        path: 'cash/create',
        component: CreateCashReqComponent,
    },
    {
        path: 'cash',
        component: CashReqListComponent,
    },
    {
        path: 'cash/:id',
        component: CashRequisitionDetailsComponent,
    },

    //card
    {
        path: 'card/create',
        component: CreateCardReqComponent,
    },
    {
        path: 'card',
        component: CardReqListComponent,
    },
    {
        path: 'card/:id',
        component: CardRequisitionDetailsComponent,
    },

    //device
    {
        path: 'device/create',
        component: CreateDeviceReqComponent,
    },
    {
        path: 'device',
        component: DeviceReqListComponent,
    },
    {
        path: 'device/:id',
        component: DeviceRequisitionDetailsComponent,
    },
    //vehicle
    {
        path: 'vehicle/create',
        component: CreateVehicleReqComponent,
    },
    {
        path: 'vehicle',
        component: VehicleReqListComponent,
    },
    {
        path: 'vehicle/:id',
        component: VehicleRequisitionDetailsComponent,
    },
    //vehicle
    {
        path: 'asset/create',
        component: CreateAssetReqComponent,
    },
    {
        path: 'asset',
        component: AssetReqListComponent,
    },
    {
        path: 'asset/:id',
        component: AssetRequisitionDetailsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequsitionsRoutingModule {}
