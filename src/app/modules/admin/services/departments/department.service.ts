import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { tap, map } from 'lodash';
import { Observable } from 'rxjs';
import { Department } from '../../models/departments/department.types';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private _baseUrl: string = environment.apiBaseUrl;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }


  saveDepartment(department: any): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}Departments`, department);
  }

  deleteDepartment(id: string) {
    return this._httpClient.delete(`${this._baseUrl}Departments/${id}`);
  }

  updateDepartment(id: string, department: Department) {
    return this._httpClient.put(`${this._baseUrl}Departments/${id}`, department)
  }

  getDepartment(id: string) {
    return this._httpClient.get<Department>(`${this._baseUrl}Departments/${id}`);
  }
  getDepartments() {
    return this._httpClient.get<Department>(`${this._baseUrl}Departments`);
  }
}