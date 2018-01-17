import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { UserService } from '../../x-shared/app/users';
import { usersRouting } from './users.routing';
import { UsersComponent } from './users.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserInfoComponent, UserDetailsComponent } from './user-info';
import { UserPasswordComponent, ChangePasswordComponent } from './user-password';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        usersRouting
    ],
    declarations: [
        UsersComponent,
        UserListComponent,
        UserInfoComponent, UserDetailsComponent, 
        UserPasswordComponent, ChangePasswordComponent
    ],
    providers: [UserService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class UsersModule { }
