import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import * as utils from 'tns-core-modules/utils/utils';

import { Media, MediaService } from '../../data/media';

import { alert } from '../../shared/dialog-util';

declare var UIColor: any;

@Component({
    selector: 'mg-media-list',
    moduleId: module.id,
    templateUrl: './media-list.component.html',
    styleUrls: ['./media-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaListComponent {
    @Input() showSelection: boolean;
    @Input() row;
    @Output() loading = new EventEmitter();
    @Output() loaded = new EventEmitter();

    listLoaded = false;

    constructor(private store: MediaService) {
    }

    load(): void {
        this.loading.next('');
        this.store.load()
            .then(
            () => {
                this.loaded.next('');
                this.listLoaded = true;
            },
            () => {
                alert('An error occurred loading your media list.');
            }
            );
    }

    // The following trick makes the background color of each cell
    // in the UITableView transparent as it’s created.
    makeBackgroundTransparent(args): void {
        let cell = args.ios;
        if (cell) {
            // support XCode 8
            cell.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
        }
    }

    icon(media: Media): string {
        if (media.deleted) {
            return String.fromCharCode(media.selected ? 0xea55 : 0xea56);
            // FIXME use fonticons classes instead of codes
            // return media.selected ? 'radio-checked2' : 'radio-unchecked';
        } else {
            return String.fromCharCode(media.selected ? 0xea52 : 0xea52);
            // FIXME use fonticons classes instead of codes
            // return media.selected ? 'checkbox-checked' : 'checkbox-unchecked';
        }
    }

    toggleSelection(media: Media): void {
        media.selected = !media.selected;
        return;
    }

    delete(media: Media): void {
        var confirmation: any = confirm('Confirm deletion of media "' + media.name + '" ?');

        let deleteConfirmed = () => {
            this.loading.next('');
            let successHandler = () => {
                media.deleting = false;
                media.deleted = true;
                this.loaded.next('');
            };
            let errorHandler = () => {
                alert('An error occurred while deleting "' + media.name + '".');
                this.loaded.next('');
            };

            this.store.delete(media)
                .then(successHandler, errorHandler);
        };

        if (confirmation === true) {
            deleteConfirmed();
        } else if (confirmation instanceof Promise) {
            (confirmation as any)
                .then((result: boolean) => {
                    if (result === true) {
                        deleteConfirmed();
                    }
                });
        }
    }
}
