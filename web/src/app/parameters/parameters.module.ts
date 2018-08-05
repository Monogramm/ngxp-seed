import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { ParametersRoutingModule } from './parameters-routing.module';

import { ParameterService } from '../../x-shared/app/parameters';

import { ParametersComponent } from './parameters.component';
import { ParameterListComponent, ParameterStatusPipe } from './parameter-list';
import { ParameterInfoComponent, ParameterDetailsComponent } from './parameter-info';

@NgModule({
    imports: [
        HttpModule,
        ParametersRoutingModule,
        SharedModule
    ],
    declarations: [
        ParametersComponent,
        ParameterListComponent,
        ParameterStatusPipe,
        ParameterInfoComponent,
        ParameterDetailsComponent
    ],
    providers: [ParameterService],
    exports: [
        ParametersComponent,
        ParameterListComponent,
        ParameterInfoComponent,
        ParameterDetailsComponent
    ]
})
export class ParametersModule { }
