import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { LocaleService } from './locale.service';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule, GuestGuard, AuthGuard, VerifyGuard, RoleGuard } from './shared';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypesModule } from './types/types.module';
import { ParametersModule } from './parameters/parameters.module';

import { environment } from '../environments/environment';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

// Register additional locales for Angular pipes
registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        CoreModule,
        SharedModule,
        HomeModule,
        LoginModule,
        UsersModule,
        RolesModule,
        TypesModule,
        ParametersModule,
        // PWA service worker
        ServiceWorkerModule.register(
            '/ngsw-worker.js', { enabled: environment.production }
        )
    ],
    providers: [
        { provide: LOCALE_ID, useValue: AppComponent.LOCALE },
        AppService, LocaleService,
        GuestGuard, AuthGuard, VerifyGuard, RoleGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
