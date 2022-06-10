import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { CashRequisition, Category } from '../../models/cash-requisitions/cash-requisitions.types';
import { environment } from 'environments/environment';


@Injectable({
    providedIn: 'root'
})
export class CashRequisitionService {
    private _baseUrl = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }


    getAllCashRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}CashRequisition?isLoggedInUser=true`);
    }
    getFilteredCashRequisitions(status:boolean): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}CashRequisition/GetFiltered?isLoggedInUser=${status}`);
    }

    getCashRequisition(id: string): Observable<any> {
        return this._httpClient.get<any[]>(`${this._baseUrl}CashRequisition/${id}`);
    }

    deleteVehicelRequisition(id: string): Observable<any> {
        return this._httpClient.delete<any[]>(`${this._baseUrl}CashRequisition/${id}`);
    }

    createCashReq(vehicleReq: any): Observable<any[]> {
        return this._httpClient.post<any>(`${this._baseUrl}CashRequisition`, vehicleReq);
    }
    lineManagerApproveReq(id: string, cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(`${this._baseUrl}CashRequisition/changelineapproval/${id}`, cashReq);
    }
    financeManagerApproveReq(id: string, cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(`${this._baseUrl}CashRequisition/changeapproval/${id}`, cashReq);
    }
    getAllCashRequisitionsLogged(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}CashRequisition?isLoggedInUser=false`);
    }
    getCashs(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}Cash`);
    }
}
