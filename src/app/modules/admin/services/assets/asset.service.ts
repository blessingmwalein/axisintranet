import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { tap, map } from 'lodash';
import { Observable } from 'rxjs';
// import { Asset } from '../../models/departments/department.types';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private _baseUrl: string = environment.apiBaseUrl;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }


  saveAsset(department: any): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}Assets`, department);
  }

  deleteAsset(id: string) {
    return this._httpClient.delete(`${this._baseUrl}Assets/${id}`);
  }

  updateAsset(id: string, department: any) {
    return this._httpClient.put(`${this._baseUrl}Assets/${id}`, department)
  }

  getAsset(id: string) {
    return this._httpClient.get<any>(`${this._baseUrl}Assets/${id}`);
  }
  getAssets() {
    return this._httpClient.get<any>(`${this._baseUrl}Assets`);
  }
}
