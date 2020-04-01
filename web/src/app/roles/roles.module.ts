import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';

import { RoleService } from '@xapp/roles';
import { PermissionService } from '@xapp/permissions';

import { RolesComponent } from './roles.component';
import { RoleListComponent, RoleStatusPipe } from './role-list';
import { RoleInfoComponent, RoleDetailsComponent } from './role-info';

@NgModule({
    imports: [
        HttpClientModule,
        RolesRoutingModule,
        SharedModule
    ],
    declarations: [
        RolesComponent,
        RoleListComponent,
        RoleStatusPipe,
        RoleInfoComponent,
        RoleDetailsComponent
    ],
    providers: [RoleService, PermissionService],
    exports: [
        RolesComponent,
        RoleListComponent,
        RoleInfoComponent,
        RoleDetailsComponent
    ]
})
export class RolesModule { }
