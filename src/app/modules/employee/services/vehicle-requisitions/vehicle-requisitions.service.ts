import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { Category, VehicleRequisition } from '../../models/vehicle-requisitions/vehicle-requisitions.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VehicleRequisitionService {
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _vehicleRequisition: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _vehicleRequisitions: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _baseUrl = environment.apiBaseUrl;

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
    get vehicleRequisition$(): Observable<any> {
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
    getVehicleRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}VehicleRequisition?isLoggedInUser=true`).pipe(
            tap((response: any) => {
                this._vehicleRequisitions.next(response);
            })
        );
    }

    getVehicles() : Observable<any[]>{
        return this._httpClient.get<any[]>(`${this._baseUrl}Vehicles`);
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
            switchMap(vehicleRequisitions => this._httpClient.post<any>(`${this._baseUrl}VehicleRequisition`, req).pipe(
                map((newReq) => {
                    return newReq;
                })
            ))
        );
    }
}
