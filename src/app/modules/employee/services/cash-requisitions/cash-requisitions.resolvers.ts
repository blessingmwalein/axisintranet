import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category, CashRequisition } from '../../models/cash-requisitions/cash-requisitions.types';
import { CashRequisitionService } from './cash-requisitions.service';

@Injectable({
    providedIn: 'root'
})
export class AcademyCategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _cashRequisitionService: CashRequisitionService) {
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
        return this._cashRequisitionService.getCategories();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CashRequisitionsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _cashRequisitionService: CashRequisitionService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CashRequisition[]> {
        return this._cashRequisitionService.getCashRequisitions();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CashRequisitionResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _cashRequisitionService: CashRequisitionService
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CashRequisition> {
        return this._cashRequisitionService.getCashRequisitionById(route.paramMap.get('id'))
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
