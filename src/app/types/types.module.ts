import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { TypesRoutingModule } from './types-routing.module';

import { TypeService } from '../data/types';

import { TypesComponent } from './types.component';
import { TypeListComponent, TypeStatusPipe } from './type-list';
import { TypeInfoComponent, TypeDetailsComponent } from './type-info';

@NgModule({
    imports: [
        HttpClientModule,
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
