import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';

import { UserService } from '../data/users';

import { UsersComponent } from './users.component';
import { UserListComponent } from './user-list';
import { UserInfoComponent, UserDetailsComponent } from './user-info';
import { UserPasswordComponent, ChangePasswordComponent } from './user-password';

@NgModule({
    imports: [
        HttpModule,
        UsersRoutingModule,
        SharedModule
    ],
    declarations: [
        UsersComponent,
        UserListComponent,
        UserInfoComponent,
        UserDetailsComponent,
        UserPasswordComponent, ChangePasswordComponent
    ],
    providers: [UserService],
    exports: [
        UsersComponent,
        UserListComponent,
        UserInfoComponent,
        UserDetailsComponent
    ]
})
export class UsersModule { }
