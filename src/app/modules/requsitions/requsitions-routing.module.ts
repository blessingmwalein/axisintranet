import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCashReqComponent } from './cash-reqs/create-cash-req/create-cash-req.component';

const routes: Routes = [
    {
        path: 'create-cash-req',
        component: CreateCashReqComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequsitionsRoutingModule {}
