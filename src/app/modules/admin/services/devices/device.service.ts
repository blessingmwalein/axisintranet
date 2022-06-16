import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { tap, map } from 'lodash';
import { Observable } from 'rxjs';
// import { Device } from '../../models/devices/device.types';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private _baseUrl: string = environment.apiBaseUrl;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }


  saveDevice(device: any): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}Devices`, device);
  }

  deleteDevice(id: string) {
    return this._httpClient.delete(`${this._baseUrl}Devices/${id}`);
  }

  updateDevice(id: string, device: any) {
    return this._httpClient.put(`${this._baseUrl}Devices/${id}`, device)
  }

  getDevice(id: string) {
    return this._httpClient.get<any>(`${this._baseUrl}Devices/${id}`);
  }
  getDevices() {
    return this._httpClient.get<any>(`${this._baseUrl}Devices`);
  }
}
