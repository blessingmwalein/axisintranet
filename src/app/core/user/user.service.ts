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

    getUserfromStorage() : User {
        return JSON.parse(sessionStorage.getItem('user'));
    }
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

    //save user role 
    saveRole(role:any) :Observable<any>{
        return this._httpClient.post<any>(`${this._baseUrl}Role/Create`, role);
    }

    deleteRole(id:string){
       return this._httpClient.delete(`${this._baseUrl}Role/Delete/${id}`);
    }

    updateRole(id:string, role:Role){
        return this._httpClient.put(`${this._baseUrl}Role/Edit/${id}`,role)
    }

    getRole(id:string){
        return this._httpClient.get<Role>(`${this._baseUrl}Role/${id}`);
    }
    //users endpoints
    createUser(user:any){
        return this._httpClient.post(`${this._baseUrl}User/Create`, user);
    }

    deleteUser(userId:string){
        return this._httpClient.delete(`${this._baseUrl}User/Delete/${userId}`);
    }

    assignUserRoles(details){
        return this._httpClient.post(`${this._baseUrl}User/AssignRoles`, details);
    }

    editUserRoles(details){
        return this._httpClient.post(`${this._baseUrl}User/EditUserRoles`, details);
    }

    editUserProfile(id:string, user:any){
         return this._httpClient.put(`${this._baseUrl}User/EditUserProfile/${id}`, user);
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

    getLocalUser() : any {
        return JSON.parse(sessionStorage.getItem('user'))
    }
}
