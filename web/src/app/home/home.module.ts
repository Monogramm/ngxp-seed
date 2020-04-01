import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { LoginService } from '@xapp/login';
import { HomeService } from '@xapp/home';

import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        HttpClientModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        HomeComponent
    ],
    providers: [LoginService, HomeService],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }
