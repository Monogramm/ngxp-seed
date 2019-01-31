import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger, Pagination } from '../../shared';
import { Media, MediaService } from '../../data';

@Component({
    selector: 'media-list',
    templateUrl: './media-list.component.html',
    styleUrls: ['./media-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaListComponent {
    @Input('filter-selected-only') showSelection: boolean = false;
    @Input('allow-edit') allowEdit: boolean = true;
    @Input('allow-delete') allowDelete: boolean = true;
    @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() loaded: EventEmitter<number> = new EventEmitter<number>();

    pagination: Pagination = new Pagination();

    constructor(public store: MediaService,
        private _translate: TranslateService,
        private _router: Router) { }

    ngOnInit() {
        this.load(1);
    }

    load(page: number): void {
        this.pagination.page = page;

        this.loading.emit(true);
        this.store.load(this.pagination)
            .then(
                () => {
                    this.loading.emit(false);
                    this.loaded.emit(this.store.count);
                },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this.loading.emit(false);
                    this.loaded.emit(0);
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
        if (!this.allowDelete) {
            return;
        }
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
        if (!this.allowEdit) {
            return;
        }
        this._router.navigate(['/media', media.id]);
    }
}
