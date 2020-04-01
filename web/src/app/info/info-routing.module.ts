import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InfoComponent } from './info.component';
import { AboutInfoComponent } from './about-info';
import { InstallInfoComponent } from './install-info';
import { LegalInfoComponent } from './legal-info';
import { UsageInfoComponent } from './usage-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'info',
                pathMatch: 'full',
                component: InfoComponent,
            },
            {
                path: 'info/about',
                component: AboutInfoComponent
            },
            {
                path: 'info/install',
                component: InstallInfoComponent,
            },
            {
                path: 'info/legal',
                component: LegalInfoComponent
            },
            {
                path: 'info/usage',
                component: UsageInfoComponent,
            }
        ])
    ],
    exports: [RouterModule]
})
export class InfoRoutingModule {

}
