import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { ResetPasswordComponent } from './reset-password';
import { RegisterComponent } from './register';

import { AuthGuard } from '../shared';

const loginRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'reset_password', component: ResetPasswordComponent },
    { path: 'register/:id', component: RegisterComponent, canActivate: [AuthGuard] },
];
export const loginRouting: ModuleWithProviders = RouterModule.forChild(loginRoutes);
