import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserPasswordComponent } from './user-password';

import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

const usersRoutes: Routes = [
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
    { path: 'user/:id', component: UserInfoComponent, canActivate: [AuthGuard] },
    { path: 'user/:id/password', component: UserPasswordComponent, canActivate: [AuthGuard] },
];
export const usersRouting: ModuleWithProviders = RouterModule.forChild(usersRoutes);