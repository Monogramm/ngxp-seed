import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParametersComponent } from './parameters.component';
import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

const parametersRoutes: Routes = [
    { path: 'parameters', component: ParametersComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
];
export const parametersRouting: ModuleWithProviders = RouterModule.forChild(parametersRoutes);