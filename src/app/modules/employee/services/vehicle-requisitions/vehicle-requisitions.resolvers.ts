import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category, VehicleRequisition } from '../../models/vehicle-requisitions/vehicle-requisitions.types';
import { VehicleRequisitionService } from './vehicle-requisitions.service';

@Injectable({
    providedIn: 'root'
})
export class AcademyCategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _vehicleRequisitionService: VehicleRequisitionService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]> {
        return this._vehicleRequisitionService.getCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class VehicleRequisitionsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _vehicleRequisitionService: VehicleRequisitionService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VehicleRequisition[]> {
        return this._vehicleRequisitionService.getVehicleRequisitions();
    }
}

@Injectable({
    providedIn: 'root'
})
export class VehicleRequisitionResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _vehicleRequisitionService: VehicleRequisitionService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<VehicleRequisition> {
        return this._vehicleRequisitionService.getVehicleRequisitionById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested task is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}
