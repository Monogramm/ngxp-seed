import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GuestGuard, AuthGuard } from '../shared';

import { LoginComponent } from './login.component';
import { ResetPasswordComponent } from './reset-password';
import { RegisterComponent } from './register';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
                canActivate: [GuestGuard]
            },
            {
                path: 'register/:id',
                component: RegisterComponent,
                canActivate: [AuthGuard]
            },
        ])
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule {

}
