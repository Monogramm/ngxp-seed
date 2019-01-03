import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
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

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
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
    providers: [AppService, GuestGuard, AuthGuard, VerifyGuard, RoleGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
