import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared/shared.module';
import { InfoRoutingModule } from './info-routing.module';

import { InfoComponent } from './info.component';
import { AboutInfoComponent } from './about-info';
import { InstallInfoComponent } from './install-info';
import { LegalInfoComponent } from './legal-info';
import { UsageInfoComponent } from './usage-info';

@NgModule({
    imports: [
        HttpModule,
        InfoRoutingModule,
        SharedModule
    ],
    declarations: [
        InfoComponent,
        AboutInfoComponent,
        InstallInfoComponent,
        LegalInfoComponent,
        UsageInfoComponent
    ],
    providers: [],
    exports: [
        InfoComponent,
        AboutInfoComponent,
        InstallInfoComponent,
        LegalInfoComponent,
        UsageInfoComponent
    ]
})
export class InfoModule { }
