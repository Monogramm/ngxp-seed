import { NgModule, isDevMode } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptHttpModule } from 'nativescript-angular/http';

import { TNSFontIconModule, TNSFontIconService } from 'nativescript-ngx-fonticon';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { AuthGuard, AdminGuard, SupportGuard } from './shared';

import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypesModule } from './types/types.module';
import { AppRoutingModule } from './app-routing.module';

// Turn debug on for development
TNSFontIconService.debug = isDevMode();

@NgModule({
    providers: [
        AuthGuard, 
        AdminGuard, 
        SupportGuard
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        TNSFontIconModule.forRoot({
            'icomoon': './icomoon.css'
        }),
        CoreModule,
        AppRoutingModule,
        LoginModule,
        UsersModule,
        RolesModule,
        TypesModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
