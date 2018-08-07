import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';

import { RoleService } from 'x-shared/app/roles';
import { PermissionService } from 'x-shared/app/permissions';

import { RolesComponent } from './roles.component';
import { RoleListComponent, RoleStatusPipe } from './role-list';
import { RoleInfoComponent, RoleDetailsComponent } from './role-info';

@NgModule({
    imports: [
        HttpModule,
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
    providers: [RoleService],
    exports: [
        RolesComponent,
        RoleListComponent,
        RoleInfoComponent,
        RoleDetailsComponent
    ]
})
export class RolesModule { }
