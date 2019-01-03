import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, VerifyGuard, RoleGuard } from '../shared';

import { TypesComponent } from './types.component';
import { TypeInfoComponent } from './type-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'types',
                pathMatch: 'full',
                component: TypesComponent,
                canActivate: [AuthGuard, VerifyGuard],
                canLoad: [RoleGuard],
                data: {
                    expectedRoles: ['Admin', 'Support']
                }
            },
            {
                path: 'type/:id',
                component: TypeInfoComponent,
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
export class TypesRoutingModule {

}
