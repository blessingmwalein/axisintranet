import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { environment } from 'environments/environment';


@Injectable({
    providedIn: 'root'
})
export class CardRequisitionService {
    private _baseUrl = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }


    getAllCardRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}CardRequisition?isLoggedInUser=true`);
    }

    getCardRequisition(id: string): Observable<any> {
        return this._httpClient.get<any[]>(`${this._baseUrl}CardRequisition/${id}`);
    }

    deleteVehicelRequisition(id: string): Observable<any> {
        return this._httpClient.delete<any[]>(`${this._baseUrl}CardRequisition/${id}`);
    }

    createCardReq(cardReq: any): Observable<any[]> {
        return this._httpClient.post<any>(`${this._baseUrl}CardRequisition`, cardReq);
    }
    getCards(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}Cards`);
    }
}
