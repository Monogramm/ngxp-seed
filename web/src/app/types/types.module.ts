import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { TypesRoutingModule } from './types-routing.module';

import { TypeService } from '../../x-shared/app/types';

import { TypesComponent } from './types.component';
import { TypeListComponent, TypeStatusPipe } from './type-list';
import { TypeInfoComponent, TypeDetailsComponent } from './type-info';

@NgModule({
    imports: [
        HttpModule,
        TypesRoutingModule,
        SharedModule
    ],
    declarations: [
        TypesComponent,
        TypeListComponent,
        TypeStatusPipe,
        TypeInfoComponent,
        TypeDetailsComponent
    ],
    providers: [TypeService],
    exports: [
        TypesComponent,
        TypeListComponent,
        TypeInfoComponent,
        TypeDetailsComponent
    ]
})
export class TypesModule { }
