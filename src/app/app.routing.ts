import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'dashboards/project',
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            { path: 'password-reset', component: AuthResetPasswordComponent },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            //employees
            {
                path: 'axis',
                children: [
                    {
                        path: 'employee',
                        loadChildren: () =>
                            import(
                                'app/modules/employee-x/employee-x.module'
                            ).then((m) => m.EmployeeXModule),
                    },
                    {
                        path: 'manager',
                        loadChildren: () =>
                            import('app/modules/manager/manager.module').then(
                                (m) => m.ManagerModule
                            ),
                    },
                    {
                        path: 'finance-manager',
                        loadChildren: () =>
                            import(
                                'app/modules/finance-manager/finance-manager.module'
                            ).then((m) => m.FinanceManagerModule),
                    },
                    {
                        path: 'g-m',
                        loadChildren: () =>
                            import(
                                'app/modules/gm/general-manager.module'
                            ).then((m) => m.GeneralManagerModule),
                    },
                    {
                        path: 'admin',
                        loadChildren: () =>
                            import('app/modules/admin/admin.module').then(
                                (m) => m.AdminModule
                            ),
                    },
                    {
                        path: 'requsitions',
                        loadChildren: () =>
                            import(
                                'app/modules/requsitions/requsitions.module'
                            ).then((m) => m.RequsitionsModule),
                    },
                ],
            },
            { path: '**', redirectTo: '404-not-found' },
        ],
    },
];
