import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { environment } from 'environments/environment';


@Injectable({
    providedIn: 'root'
})
export class DeviceRequisitionService {
    private _baseUrl = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }


    getAllDeviceRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}DeviceRequisition?isLoggedInUser=true`);
    }

    getDeviceRequisition(id: string): Observable<any> {
        return this._httpClient.get<any[]>(`${this._baseUrl}DeviceRequisition/${id}`);
    }

    deleteVehicelRequisition(id: string): Observable<any> {
        return this._httpClient.delete<any[]>(`${this._baseUrl}DeviceRequisition/${id}`);
    }

    createDeviceReq(deviceReq: any): Observable<any[]> {
        return this._httpClient.post<any>(`${this._baseUrl}DeviceRequisition`, deviceReq);
    }
    getDevices(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}Devices`);
    }
}