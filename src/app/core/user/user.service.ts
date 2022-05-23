import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Role } from 'app/modules/admin/models/users/role.types';
import { environment } from 'environments/environment';
import { User } from 'app/modules/admin/models/users/users.types';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _users: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
    private _baseUrl: string = environment.apiBaseUrl;
    private _roles: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(userId: string): Observable<User> {
        return this._httpClient.get<User>(`${this._baseUrl}User/GetUserDetails/${userId}`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    //get user roles from
    getAllRoles(): Observable<Role[]>{
        return this._httpClient.get<Role[]>(`${this._baseUrl}Role/GetAll`).pipe(
          tap((response) => {
              this._roles.next(response);
            sessionStorage.setItem('userRoles', JSON.stringify(response))
          })
        );
    }

    getAllUsers(): Observable<User[]>{
        return this._httpClient.get<User[]>(`${this._baseUrl}User/GetAll`).pipe(
          tap((response) => {
              this._users.next(response);
          })
        );
    }

    getRolesFromStorage(): Role[]{
        return JSON.parse(sessionStorage.getItem('userRoles'));
    }

    setUser(user: User) : void {
        sessionStorage.setItem('user', JSON.stringify(user));
    }
}
