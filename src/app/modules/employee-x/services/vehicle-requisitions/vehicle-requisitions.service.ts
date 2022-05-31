import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VehicleRequisitionService {

    private _baseUrl = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }


    getAllVehicleRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}VehicleRequisition?isLoggedInUser=true`);
    }

    getVehicelRequisition(id: string): Observable<any> {
        return this._httpClient.get<any[]>(`${this._baseUrl}VehicleRequisition/${id}`);
    }

    deleteVehicelRequisition(id: string): Observable<any> {
        return this._httpClient.delete<any[]>(`${this._baseUrl}VehicleRequisition/${id}`);
    }

    createVehicleReq(vehicleReq: any): Observable<any[]> {
        return this._httpClient.post<any>(`${this._baseUrl}VehicleRequisition`, vehicleReq);
    }
    getVehicles(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}Vehicles`);
    }

}
