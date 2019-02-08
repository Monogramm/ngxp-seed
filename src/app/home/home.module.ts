import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LoginService } from '../data/login';
import { HomeService } from '../data/home';

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
