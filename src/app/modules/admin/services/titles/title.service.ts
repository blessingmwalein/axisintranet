import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { tap, map } from 'lodash';
import { Observable } from 'rxjs';
import { Title } from '../../models/titles/title.types';

@Injectable({
    providedIn: 'root',
})
export class TitleService {
    private _baseUrl: string = environment.apiBaseUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    saveTitle(title: any): Observable<any> {
        return this._httpClient.post<any>(`${this._baseUrl}Titles`, title);
    }

    deleteTitle(id: string) {
        return this._httpClient.delete(`${this._baseUrl}Titles/${id}`);
    }

    updateTitle(id: string, title: Title) {
        return this._httpClient.put(`${this._baseUrl}Titles/${id}`, title);
    }

    getTitle(id: string) {
        return this._httpClient.get<Title>(`${this._baseUrl}Titles/${id}`);
    }
    getTitles() {
        return this._httpClient.get<any>(`${this._baseUrl}Titles`);
    }
}
