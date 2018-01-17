import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

import { TypesComponent } from './types.component';
import { TypeInfoComponent } from './type-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'types', pathMatch: 'full', component: TypesComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
            { path: 'type/:id', component: TypeInfoComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] }
        ])
    ],
    exports: [RouterModule]
})
export class TypesRoutingModule {

}
