import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { Role } from 'app/modules/admin/models/users/role.types';
import { tap } from 'lodash';
import { User } from '../user/user.types';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;
    private _baseUrl: string = environment.apiBaseUrl;
    private _roles: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        sessionStorage.setItem('token', token);
    }

    get accessToken(): string {
        return sessionStorage.getItem('token') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(credentials: { email: string }): Observable<any> {
        return this._httpClient.post(
            `${this._baseUrl}Account/RequestPasswordReset`,
            credentials
        );
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(credentials: any): Observable<any> {
        return this._httpClient.post(
            `${this._baseUrl}Account/ResetPassword`,
            credentials
        );
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient
            .post(`${this._baseUrl}Account/login`, credentials)
            .pipe(
                switchMap((response: any) => {
                    // Store the access token in the local storage
                    console.log(response);

                    this.accessToken = response.token;
                    sessionStorage.setItem(
                        'userDetails',
                        JSON.stringify(response)
                    );
                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    sendResetPasswordLink(credentials: { email: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient
            .post(`${this._baseUrl}Account/RequestPasswordReset`, credentials)
            .pipe(
                switchMap((response: any) => {
                    // Store the access token in the local storage
                    console.log(response);

                    // Return a new observable with the response
                    return of(response);
                })
            );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient
            .post('api/auth/refresh-access-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Store the access token in the local storage
                    this.accessToken = response.accessToken;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        sessionStorage.clear();

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        // if (this._authenticated) {
        //     return of(true);
        // }

        // console.log("token"+this.accessToken);

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }
        // Check the access token expire date
        // if (AuthUtils.isTokenExpired(this.accessToken)) {
        //     return of(false);
        // }

        // If the access token exists and it didn't expire, sign in using it
        // return this.signInUsingToken();
        return of(true);
    }
}
