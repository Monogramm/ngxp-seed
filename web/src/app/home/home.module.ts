import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { LoginService } from '../../x-shared/app/login';
import { HomeService } from '../../x-shared/app/home';

import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        HttpModule,
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
