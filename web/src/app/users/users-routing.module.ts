import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

import { UsersComponent } from './users.component';
import { UserInfoComponent } from './user-info';
import { UserPasswordComponent } from './user-password';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'users', pathMatch: 'full', component: UsersComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
            { path: 'user/:id', component: UserInfoComponent, canActivate: [AuthGuard] },
            { path: 'user/:id/password', component: UserPasswordComponent, canActivate: [AuthGuard] }
        ])
    ],
    exports: [RouterModule]
})
export class UsersRoutingModule {

}
