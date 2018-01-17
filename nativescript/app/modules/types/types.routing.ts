import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypesComponent } from './types.component';
import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

const typesRoutes: Routes = [
    { path: 'types', component: TypesComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
];
export const typesRouting: ModuleWithProviders = RouterModule.forChild(typesRoutes);