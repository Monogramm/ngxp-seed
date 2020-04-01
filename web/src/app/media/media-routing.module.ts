import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, VerifyGuard, RoleGuard } from '../shared';

import { MediaComponent } from './media.component';
import { MediaInfoComponent } from './media-info';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'mediums',
                pathMatch: 'full',
                component: MediaComponent,
                canActivate: [AuthGuard, VerifyGuard],
                canLoad: [RoleGuard],
                data: {
                    expectedMedia: ['Admin', 'Support']
                }
            },
            {
                path: 'media/:id',
                component: MediaInfoComponent,
                canActivate: [AuthGuard, VerifyGuard],
                canLoad: [RoleGuard],
                data: {
                    expectedMedia: ['Admin', 'Support']
                }
            },
            {
                path: 'media',
                component: MediaInfoComponent,
                canActivate: [AuthGuard, VerifyGuard],
                canLoad: [RoleGuard],
                data: {
                    expectedMedia: ['Admin', 'Support']
                }
            }
        ])
    ],
    exports: [RouterModule]
})
export class MediaRoutingModule {

}
