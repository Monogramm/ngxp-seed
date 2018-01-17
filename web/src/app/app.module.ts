import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AppService } from './app.service';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule, AuthGuard, AdminGuard, SupportGuard } from './shared';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypesModule } from './types/types.module';

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
        TypesModule
    ],
    providers: [AppService, AuthGuard, AdminGuard, SupportGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
