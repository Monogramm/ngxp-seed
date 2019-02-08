import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { MediaRoutingModule } from './media-routing.module';

import { MediaService, PermissionService } from '../data';

import { MediaComponent } from './media.component';
import { MediaListComponent, MediaStatusPipe } from './media-list';
import { MediaInfoComponent, MediaDetailsComponent } from './media-info';

@NgModule({
    imports: [
        HttpClientModule,
        MediaRoutingModule,
        SharedModule
    ],
    declarations: [
        MediaComponent,
        MediaListComponent,
        MediaStatusPipe,
        MediaInfoComponent,
        MediaDetailsComponent
    ],
    providers: [MediaService, PermissionService],
    exports: [
        MediaComponent,
        MediaListComponent,
        MediaInfoComponent,
        MediaDetailsComponent
    ]
})
export class MediaModule { }
