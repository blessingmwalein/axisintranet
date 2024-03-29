import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import {
    CashRequisition,
    Category,
} from '../../models/cash-requisitions/cash-requisitions.types';
import { environment } from 'environments/environment';
import { NotificationsService } from '../nortifications/notifications.service';

@Injectable({
    providedIn: 'root',
})
export class CashRequisitionService {
    private _baseUrl = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private not:NotificationsService) {}

    getAllCashRequisitions(): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition?isLoggedInUser=true`
        );
    }
    getFilteredCashRequisitions(status: boolean): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition/GetFiltered?isLoggedInUser=${status}`
        );
    }

    getCashRequisition(id: string): Observable<any> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition/${id}`
        );
    }

    deleteVehicelRequisition(id: string): Observable<any> {
        return this._httpClient.delete<any[]>(
            `${this._baseUrl}CashRequisition/${id}`
        );
    }

    createCashReq(vehicleReq: any): Observable<any[]> {
        let httpOptions = {
            headers: new HttpHeaders({
                enctype: 'multipart/form-data',
                Accept: 'application/json',
            }),
        };
        return this._httpClient.post<any>(
            `${this._baseUrl}CashRequisition`,
            vehicleReq,
            httpOptions
        );
    }

    lineManagerApproveReq( cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CashRequisition/changelineapproval`,
            cashReq
        );
    }
    financeManagerApproveReq( cashReq: any): Observable<any[]> {
        // var response = await this.not.sendApprovedWhatsappMessageToUser();
        return this._httpClient.put<any>(
            `${this._baseUrl}CashRequisition/changeapproval`,
            cashReq
        );
    }
    generalManagerApproveReq(cashReq: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CashRequisition/changegmapproval`,
            cashReq
        );
    }
    getAllCashRequisitionsLogged(): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition?isLoggedInUser=false`
        );
    }
    getCashs(): Observable<any[]> {
        return this._httpClient.get<any[]>(`${this._baseUrl}Cash`);
    }

    getCashRequsitionByStatus(status: string): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition/GetByStatus?status=${status}&isLoggedInUser=false`
        );
    }
    updateReleasedFunds(data: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CashRequisition/updatereleasedfunds/${data.id}`,
            data
        );
    }
    updateReceivedFunds(data: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CashRequisition/updatereceivedfunds/${data.id}`,
            data
        );
    }
    updateUsedFunds(data: any): Observable<any[]> {
        return this._httpClient.put<any>(
            `${this._baseUrl}CashRequisition/updateactualusedfunds/${data.id}`,
            data
        );
    }
    getMonthToMonthReport(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition/MonthToMonthReport/${data.id}/${data.status}`
        );
    }

    getMonthToMonthDetail(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition/MonthToMonthReportDetail/${data.id}/${data.status}`
        );
    }
    getDayToDayReport(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition/DayToDayReport/${data.id}/${data.status}`
        );
    }
    getDayToDayReportDetail(data: any): Observable<any[]> {
        return this._httpClient.get<any[]>(
            `${this._baseUrl}CashRequisition/DayToDayReportDetail/${data.id}/${data.status}`
        );
    }
}
