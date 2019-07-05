import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { WorkerService } from '../../../core';

import { Media, MediaService } from '../../../data';

@Component({
    selector: 'app-media-details',
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDetailsComponent {
    @Input() media: Media;
    @Output() ready = new EventEmitter();

    fileToUpload: File = null;

    constructor(public store: MediaService, private worker: WorkerService) {
    }

    handleFileInput(files: FileList) {
        this.media.resource = files.item(0);
        if (!!!this.media.name) {
            this.media.name = this.media.resource.name;
        }
    }
}
