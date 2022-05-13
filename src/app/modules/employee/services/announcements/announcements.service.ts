import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Announcement } from '../../models/announcements/announcements.types';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementsService {
    // Private
    private _announcements: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for announcements
     */
    get announcements(): Observable<any> {
        return this._announcements.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get announcements
     */
    getAnnouncements(): Observable<any> {
        return this._httpClient.get<Announcement[]>('api/pages/announcements').pipe(
            tap((response: Announcement[]) => {
                this._announcements.next(response);
            })
        );
    }
}
