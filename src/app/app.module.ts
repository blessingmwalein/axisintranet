import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { AdminModule } from './modules/admin/admin.module';
import { ManagerModule } from './modules/manager/manager.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FinanceManagerModule } from './modules/finance-manager/finance-manager.module';
import { EmployeeXModule } from './modules/employee-x/employee-x.module';
import { GeneralManagerModule } from './modules/gm/general-manager.module';
import { RequsitionsModule } from './modules/requsitions/requsitions.module';
import { AuthResetPasswordModule } from './modules/auth/reset-password/reset-password.module';
import { AuthResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from './shared/shared.module';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    useHash: true,
};

@NgModule({
    declarations: [AppComponent,AuthResetPasswordComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        // Core module of your application
        CoreModule,
        // Layout module of your application
        LayoutModule,
        MatSnackBarModule,
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        AdminModule,
        ManagerModule,
        FinanceManagerModule,
        GeneralManagerModule,
        EmployeeXModule,
        RequsitionsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
