import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { CashRequisition , Category} from '../../models/cash-requisitions/cash-requisitions.types';


@Injectable({
    providedIn: 'root'
})
export class CashRequisitionService {
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _cashRequisition: BehaviorSubject<CashRequisition | null> = new BehaviorSubject(null);
    private _cashRequisitions: BehaviorSubject<CashRequisition[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]> {
        return this._categories.asObservable();
    }

    
    /** get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }
     * Getter for cashRequisitions
     */
    get cashRequisitions$(): Observable<any[]> {
        return this._cashRequisitions.asObservable();
    }

    /**
     * Getter for CashRequisition
     */
    get CashRequisition$(): Observable<CashRequisition> {
        return this._cashRequisition.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategories(): Observable<Category[]> {
        return this._httpClient.get<Category[]>('api/apps/vehicle-requisitions/categories').pipe(
            tap((response: any) => {
                this._categories.next(response);
            })
        );
    }

    /**
     * Get cashRequisitions
     */
    getCashRequisitions(): Observable<CashRequisition[]> {
        return this._httpClient.get<CashRequisition[]>('api/apps/vehicle-requisitions/vehicle-requisitions').pipe(
            tap((response: any) => {
                this._cashRequisitions.next(response);
            })
        );
    }

    /**
     * Get CashRequisition by id
     */
    getCashRequisitionById(id: string): Observable<CashRequisition> {
        return this._httpClient.get<CashRequisition>('api/apps/vehicle-requisitions/vehicle-requisitions/vehicle-requisition', { params: { id } }).pipe(
            map((CashRequisition) => {

                // Update the CashRequisition
                this._cashRequisition.next(CashRequisition);

                // Return the CashRequisition
                return CashRequisition;
            }),
            switchMap((CashRequisition) => {

                if (!CashRequisition) {
                    return throwError('Could not found CashRequisition with id of ' + id + '!');
                }

                return of(CashRequisition);
            })
        );
    }

    createRequ(req: any): Observable<any> {
        return this.cashRequisitions$.pipe(
            take(1),
            switchMap(cashRequisitions => this._httpClient.post<any>('api/apps/vehicle-requisitions/vehicle-requisitions', { req }).pipe(
                map((newReq) => {

                    console.log(this.cashRequisitions$);
                    
                    // Update the tags with the new tag
                    this._cashRequisitions.next([...cashRequisitions, newReq]);


                    // Return new tag from observable
                    return newReq;
                })
            ))
        );
    }
}
