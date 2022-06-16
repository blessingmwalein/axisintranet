import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { tap, map } from 'lodash';
import { Observable } from 'rxjs';
// import { Cash } from '../../models/cashs/cash.types';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  private _baseUrl: string = environment.apiBaseUrl;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }


  saveCash(cash: any): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}Cash`, cash);
  }

  deleteCash(id: string) {
    return this._httpClient.delete(`${this._baseUrl}Cash/${id}`);
  }

  updateCash(id: string, cash: any) {
    return this._httpClient.put(`${this._baseUrl}Cash/${id}`, cash)
  }

  getCash(id: string) {
    return this._httpClient.get<any>(`${this._baseUrl}Cash/${id}`);
  }
  getCashs() {
    return this._httpClient.get<any>(`${this._baseUrl}Cash`);
  }
}
