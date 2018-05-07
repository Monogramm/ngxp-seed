import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, AdminGuard, SupportGuard } from '../shared';

import { ParametersComponent } from './parameters.component';
import { ParameterInfoComponent } from './parameter-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'parameters', pathMatch: 'full', component: ParametersComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] },
            { path: 'parameter/:id', component: ParameterInfoComponent, canActivate: [AuthGuard], canLoad: [AdminGuard, SupportGuard] }
        ])
    ],
    exports: [RouterModule]
})
export class ParametersRoutingModule {

}
