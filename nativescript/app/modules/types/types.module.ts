import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { TypeService } from '../../x-shared/app/types';
import { typesRouting } from './types.routing';
import { TypesComponent } from './types.component';
import { TypeListComponent } from './type-list/type-list.component';
import { TypeStatusPipe } from './type-list/type-status-pipe';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        typesRouting
    ],
    declarations: [
        TypesComponent,
        TypeListComponent,
        TypeStatusPipe
    ],
    providers: [TypeService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class TypesModule { }
