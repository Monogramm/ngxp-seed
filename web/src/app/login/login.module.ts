import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';

import { LoginService } from '../../x-shared/app/login';

import { LoginComponent } from './login.component';
import { ResetPasswordComponent, ChangePasswordComponent } from './reset-password';
import { RegisterComponent, VerifyAccountComponent } from './register';

@NgModule({
    imports: [
        HttpModule,
        LoginRoutingModule,
        SharedModule
    ],
    declarations: [
        LoginComponent, 
        ResetPasswordComponent, ChangePasswordComponent,
        RegisterComponent, VerifyAccountComponent
    ],
    providers: [LoginService],
    exports: [
        LoginComponent, 
        ResetPasswordComponent, ChangePasswordComponent,
        RegisterComponent, VerifyAccountComponent
    ]
})
export class LoginModule { }
