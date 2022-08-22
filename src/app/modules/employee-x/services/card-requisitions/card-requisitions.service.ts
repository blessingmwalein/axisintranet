import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CardRequisitionService {
    private _baseUrl = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    getAllCardRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition?isLoggedInUser=true`
        );
    }
    getFilteredCardRequisitions(status: boolean): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition/GetFiltered?isLoggedInUser=${status}`
        );
    }

    getCardRequisition(id: string): Observable<any> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition/${id}`
        );
    }

    deleteVehicelRequisition(id: string): Observable<any> {
        return this._httpClient.delete<any[]>(
            `${this._baseUrl}CardRequisition/${id}`
        );
    }

    createCardReq(cardReq: FormData): Observable<any[]> {
        console.log(JSON.stringify(cardReq));

        let httpOptions = {
            headers: new HttpHeaders({
                'enctype': 'multipart/form-data',
                'Accept': 'application/json',
            }),
        };
        return this._httpClient.post<any>(
            `${this._baseUrl}CardRequisition`,
            cardReq,
            httpOptions
        );
    }
    lineManagerApproveReq(id: string, cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CardRequisition/changelineapproval/${id}`,
            cashReq
        );
    }
    getAllCardRequisitionsLogged(): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition?isLoggedInUser=false`
        );
    }
    financeManagerApproveReq(id: string, cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CardRequisition/changeapproval/${id}`,
            cashReq
        );
    }
    generalManagerApproveReq(id: string, cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CardRequisition/changegmapproval/${id}`,
            cashReq
        );
    }
    getCards(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}Cards`);
    }
    getCardRequsitionByStatus(status: string): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition/GetByStatus?status=${status}&isLoggedInUser=false`
        );
    }
    updateReleasedFunds(data: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CardRequisition/updatereleasedfunds/${data.id}`,
            data
        );
    }
    updateReceivedFunds(data: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CardRequisition/updatereceivedfunds/${data.id}`,
            data
        );
    }
    updateUsedFunds(data: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CardRequisition/updateactualusedfunds/${data.id}`,
            data
        );
    }

    getMonthToMonthReport(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition/MonthToMonthReport/${data.id}/${data.status}`
        );
    }
    getMonthToMonthDetail(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition/MonthToMonthReport/${data.id}/${data.status}`
        );
    }
    getDayToDayReport(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition/DayToDayReport/${data.id}/${data.status}`
        );
    }
    getDayToDayReportDetail(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CardRequisition/DayToDayReport/${data.id}/${data.status}`
        );
    }
}
