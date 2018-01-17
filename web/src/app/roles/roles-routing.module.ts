import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

import { RolesComponent } from './roles.component';
import { RoleInfoComponent } from './role-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'roles', pathMatch: 'full', component: RolesComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
            { path: 'role/:id', component: RoleInfoComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] }
        ])
    ],
    exports: [RouterModule]
})
export class RolesRoutingModule {

}
