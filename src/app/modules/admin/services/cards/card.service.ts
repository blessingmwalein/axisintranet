import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { tap, map } from 'lodash';
import { Observable } from 'rxjs';
// import { Card } from '../../models/cards/card.types';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private _baseUrl: string = environment.apiBaseUrl;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }


  saveCard(card: any): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}Cards`, card);
  }

  deleteCard(id: string) {
    return this._httpClient.delete(`${this._baseUrl}Cards/${id}`);
  }

  updateCard(id: string, card: any) {
    return this._httpClient.put(`${this._baseUrl}Cards/${id}`, card)
  }

  getCard(id: string) {
    return this._httpClient.get<any>(`${this._baseUrl}Cards/${id}`);
  }
  getCards() {
    return this._httpClient.get<any>(`${this._baseUrl}Cards`);
  }
}
