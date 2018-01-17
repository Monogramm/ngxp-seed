import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './shared/auth-guard.service';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'login', pathMatch: 'full', component: LoginComponent },
            { path: '', pathMatch: 'full', component: HomeComponent, canActivate: [AuthGuard] }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}
