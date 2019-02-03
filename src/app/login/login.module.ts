import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';

import { LoginService } from '../data/login';

import { LoginComponent } from './login.component';
import { ResetPasswordComponent, ChangePasswordComponent } from './reset-password';
import { RegisterComponent } from './register';

@NgModule({
    imports: [
        HttpModule,
        LoginRoutingModule,
        SharedModule
    ],
    declarations: [
        LoginComponent,
        ResetPasswordComponent, ChangePasswordComponent,
        RegisterComponent
    ],
    providers: [LoginService],
    exports: [
        LoginComponent,
        ResetPasswordComponent, ChangePasswordComponent,
        RegisterComponent
    ]
})
export class LoginModule { }
