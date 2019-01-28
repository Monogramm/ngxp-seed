import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';
import { InfoRoutingModule } from './info-routing.module';

import { InfoComponent } from './info.component';
import { AboutInfoComponent } from './about-info';
import { InstallInfoComponent } from './install-info';

@NgModule({
    imports: [
        HttpModule,
        InfoRoutingModule,
        SharedModule
    ],
    declarations: [
        InfoComponent,
        AboutInfoComponent,
        InstallInfoComponent
    ],
    providers: [],
    exports: [
        InfoComponent,
        AboutInfoComponent,
        InstallInfoComponent
    ]
})
export class InfoModule { }
