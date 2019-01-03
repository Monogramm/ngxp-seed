import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, VerifyGuard, RoleGuard } from '../shared';

import { ParametersComponent } from './parameters.component';
import { ParameterInfoComponent } from './parameter-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'parameters',
                pathMatch: 'full',
                component: ParametersComponent,
                canActivate: [AuthGuard, VerifyGuard],
                canLoad: [RoleGuard],
                data: {
                    expectedRoles: ['Admin', 'Support']
                }
            },
            {
                path: 'parameter/:id',
                component: ParameterInfoComponent,
                canActivate: [AuthGuard, VerifyGuard],
                canLoad: [RoleGuard],
                data: {
                    expectedRoles: ['Admin', 'Support']
                }
            }
        ])
    ],
    exports: [RouterModule]
})
export class ParametersRoutingModule {

}
