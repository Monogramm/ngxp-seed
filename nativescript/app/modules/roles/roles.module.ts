import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { RoleService } from '../../x-shared/app/roles';
import { PermissionService } from '../../x-shared/app/permissions';

import { rolesRouting } from './roles.routing';
import { RolesComponent } from './roles.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleStatusPipe } from './role-list/role-status-pipe';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        rolesRouting
    ],
    declarations: [
        RolesComponent,
        RoleListComponent,
        RoleStatusPipe
    ],
    providers: [RoleService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class RolesModule { }
