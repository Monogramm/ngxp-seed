import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared';
import { Media, MediaService } from '../../data';

@Component({
    selector: 'media-list',
    templateUrl: './media-list.component.html',
    styleUrls: ['./media-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaListComponent {
    @Input() showSelection: boolean;
    @Output() loaded = new EventEmitter();

    constructor(public store: MediaService,
        private _translate: TranslateService,
        private _router: Router) { }

    ngOnInit() {
        this.store.load()
            .then(
                () => this.loaded.emit('loaded'),
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this.loaded.emit('loaded');
                }
            );
    }

    imageSource(media: Media) {
        if (media.deleted) {
            return media.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked'
        }
        return media.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(media: Media) {
        media.selected = !media.selected;
        return;
    }

    delete(media: Media) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            media.deleting = true;

            this.store.delete(media)
                .then(
                    () => { media.deleting = false; media.deleted = true; },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
                    }
                );
        }
    }

    edit(media: Media) {
        this._router.navigate(['/media', media.id]);
    }
}
