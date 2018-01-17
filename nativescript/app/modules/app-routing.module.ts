import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { HomeComponent } from './home/home.component';

import { AuthGuard } from './shared/auth-guard.service';

@NgModule({
    imports: [
        NativeScriptRouterModule.forRoot([
            { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard] }
        ])
    ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {

}
