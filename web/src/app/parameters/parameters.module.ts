import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ParametersRoutingModule } from './parameters-routing.module';

import { ParameterService } from '@xapp/parameters';

import { ParametersComponent } from './parameters.component';
import { ParameterListComponent, ParameterStatusPipe } from './parameter-list';
import { ParameterInfoComponent, ParameterDetailsComponent } from './parameter-info';

@NgModule({
    imports: [
        HttpClientModule,
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
