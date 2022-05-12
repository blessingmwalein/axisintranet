import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from '../admin/apps/ecommerce/inventory/inventory.resolvers';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleRequisitionComponent } from './vehicle-requisition/vehicle-requisition.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'requisitions/vehicle',
    component: VehicleRequisitionComponent,
    resolve: {
      brands: InventoryBrandsResolver,
      categories: InventoryCategoriesResolver,
      products: InventoryProductsResolver,
      tags: InventoryTagsResolver,
      vendors: InventoryVendorsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
