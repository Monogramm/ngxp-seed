import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, VerifyGuard, RoleGuard } from '../shared';

import { RolesComponent } from './roles.component';
import { RoleInfoComponent } from './role-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'roles',
                pathMatch: 'full',
                component: RolesComponent,
                canActivate: [AuthGuard, VerifyGuard],
                canLoad: [RoleGuard],
                data: {
                    expectedRoles: ['Admin', 'Support']
                }
            },
            {
                path: 'role/:id',
                component: RoleInfoComponent,
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
export class RolesRoutingModule {

}
