import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesComponent } from './roles.component';
import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

const rolesRoutes: Routes = [
    { path: 'roles', component: RolesComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
];
export const rolesRouting: ModuleWithProviders = RouterModule.forChild(rolesRoutes);