import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { tap, map } from 'lodash';
import { Observable } from 'rxjs';
// import { Vehicle } from '../../models/vehicles/vehicle.types';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private _baseUrl: string = environment.apiBaseUrl;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }


  saveVehicle(vehicle: any): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}Vehicles`, vehicle);
  }

  deleteVehicle(id: string) {
    return this._httpClient.delete(`${this._baseUrl}Vehicles/${id}`);
  }

  updateVehicle(id: string, vehicle: any) {
    return this._httpClient.put(`${this._baseUrl}Vehicles/${id}`, vehicle)
  }

  getVehicle(id: string) {
    return this._httpClient.get<any>(`${this._baseUrl}Vehicles/${id}`);
  }
  getVehicles() {
    return this._httpClient.get<any>(`${this._baseUrl}Vehicles`);
  }
}
