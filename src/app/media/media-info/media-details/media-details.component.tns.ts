import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { WorkerService } from '../../../core';

import { Media, MediaService } from '../../../data';

@Component({
    selector: 'app-tns-media-details',
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDetailsComponent {
    @Input() media: Media;
    @Output() ready = new EventEmitter();

    constructor(public store: MediaService, private worker: WorkerService) {
    }
}
