import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { Category, VehicleRequisition } from '../../models/vehicle-requisitions/vehicle-requisitions.types';

@Injectable({
    providedIn: 'root'
})
export class VehicleRequisitionService {
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _vehicleRequisition: BehaviorSubject<VehicleRequisition | null> = new BehaviorSubject(null);
    private _vehicleRequisitions: BehaviorSubject<VehicleRequisition[] | null> = new BehaviorSubject(null);

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
     * Getter for VehicleRequisitions
     */
    get vehicleRequisitions$(): Observable<any[]> {
        return this._vehicleRequisitions.asObservable();
    }

    /**
     * Getter for VehicleRequisition
     */
    get vehicleRequisition$(): Observable<VehicleRequisition> {
        return this._vehicleRequisition.asObservable();
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
     * Get VehicleRequisitions
     */
    getVehicleRequisitions(): Observable<VehicleRequisition[]> {
        return this._httpClient.get<VehicleRequisition[]>('api/apps/vehicle-requisitions/vehicle-requisitions').pipe(
            tap((response: any) => {
                this._vehicleRequisitions.next(response);
            })
        );
    }

    /**
     * Get VehicleRequisition by id
     */
    getVehicleRequisitionById(id: string): Observable<VehicleRequisition> {
        return this._httpClient.get<VehicleRequisition>('api/apps/vehicle-requisitions/vehicle-requisitions/vehicle-requisition', { params: { id } }).pipe(
            map((VehicleRequisition) => {

                // Update the VehicleRequisition
                this._vehicleRequisition.next(VehicleRequisition);

                // Return the VehicleRequisition
                return VehicleRequisition;
            }),
            switchMap((VehicleRequisition) => {

                if (!VehicleRequisition) {
                    return throwError('Could not found VehicleRequisition with id of ' + id + '!');
                }

                return of(VehicleRequisition);
            })
        );
    }

    createRequ(req: any): Observable<any> {
        return this.vehicleRequisitions$.pipe(
            take(1),
            switchMap(vehicleRequisitions => this._httpClient.post<any>('api/apps/vehicle-requisitions/vehicle-requisitions', { req }).pipe(
                map((newReq) => {

                    console.log(this.vehicleRequisitions$);
                    
                    // Update the tags with the new tag
                    this._vehicleRequisitions.next([...vehicleRequisitions, newReq]);


                    // Return new tag from observable
                    return newReq;
                })
            ))
        );
    }
}
