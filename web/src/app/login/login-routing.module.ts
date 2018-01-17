import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

import { LoginComponent } from './login.component';
import { ResetPasswordComponent } from './reset-password';
import { RegisterComponent } from './register';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'login', component: LoginComponent },
            { path: 'reset_password', component: ResetPasswordComponent },
            { path: 'register/:id', component: RegisterComponent, canActivate: [AuthGuard] },
        ])
    ],
    exports: [RouterModule]
})
export class LoginRoutingModule {

}
