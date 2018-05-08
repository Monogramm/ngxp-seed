import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { ParameterService } from '../../x-shared/app/parameters';
import { parametersRouting } from './parameters.routing';
import { ParametersComponent } from './parameters.component';
import { ParameterListComponent } from './parameter-list/parameter-list.component';
import { ParameterStatusPipe } from './parameter-list/parameter-status-pipe';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        parametersRouting
    ],
    declarations: [
        ParametersComponent,
        ParameterListComponent,
        ParameterStatusPipe
    ],
    providers: [ParameterService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ParametersModule { }
