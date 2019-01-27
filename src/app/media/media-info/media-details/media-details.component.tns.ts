import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { WorkerService } from '../../../core';

import { Media, MediaService, Permission, PermissionService } from '../../../data';

@Component({
    selector: 'media-details',
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDetailsComponent {
    @Input() media: Media;
    @Output() ready = new EventEmitter();

    private items: BehaviorSubject<Array<Permission>> = new BehaviorSubject([]);
    permissions: Array<Permission>;

    constructor(public store: MediaService, public permissionService: PermissionService, private worker: WorkerService) {
    }

    ngOnInit() {
        this.permissionService.load()
            .then(() => {
                // Make sure all updates are published inside NgZone so that change detection is triggered if needed
                this.worker.run(() => {
                    this.permissions = this.permissionService.items.getValue();
                    // must emit a *new* value (immutability!)
                    this.items.next([...this.permissions]);
                    this.ready.emit('permissions loaded');
                });
            });
    }
}
