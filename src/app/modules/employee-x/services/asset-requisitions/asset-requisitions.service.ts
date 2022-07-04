import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { environment } from 'environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AssetRequisitionService {
    private _baseUrl = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }


    getAllAssetRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}AssetRequisition?isLoggedInUser=true`);
    }
    getAllAssetRequisitionsLogged(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}AssetRequisition?isLoggedInUser=false`);
    }
    getFilteredAssetRequisitionsLogged(status:boolean): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}AssetRequisition/GetFiltered?isLoggedInUser=${status}`);
    }
    getAssetRequsitionByStatus(status:string): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}AssetRequisition/GetByStatus?status=${status}&isLoggedInUser=false`);
    }

    getAssetRequisition(id: string): Observable<any> {
        return this._httpClient.get<any[]>(`${this._baseUrl}AssetRequisition/${id}`);
    }

    deleteAssetRequisition(id: string): Observable<any> {
        return this._httpClient.delete<any[]>(`${this._baseUrl}AssetRequisition/${id}`);
    }

    createAssetReq(assetReq: any): Observable<any[]> {
        return this._httpClient.post<any>(`${this._baseUrl}AssetRequisition`, assetReq);
    }
    lineManagerApproveReq(id: string, cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(`${this._baseUrl}AssetRequisition/changelineapproval/${id}`, cashReq);
    }
    financeManagerApproveReq(id: string, cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(`${this._baseUrl}AssetRequisition/changeapproval/${id}`, cashReq);
    }
    getAssets(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}Assets`);
    }
}
