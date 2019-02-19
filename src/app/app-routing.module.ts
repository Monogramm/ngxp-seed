import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent, RegisterComponent } from './login';
import { GuestGuard, AuthGuard, VerifyGuard } from './shared';

const routerOptions: ExtraOptions = {
    useHash: false,
    anchorScrolling: 'enabled'
};

export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
        canActivate: [GuestGuard]
    },
    {
        path: 'register/:id',
        component: RegisterComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, routerOptions)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}
