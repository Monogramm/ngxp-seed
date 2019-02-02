import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared';
import { Media, MediaService } from '../../data';

import { MediaDetailsComponent } from './media-details';

@Component({
    selector: 'media-info',
    templateUrl: './media-info.component.html',
    styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit {
    media: Media;
    busy: boolean = false;

    constructor(public store: MediaService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => {
                this.busy = true;
                var entityId = params['id'];
                if (entityId) {
                    return this.store.get(params['id']);
                } else {
                    return Promise.resolve();
                }
            }))
            .subscribe((data: any) => {
                this.busy = false;
                if (data) {
                    this.media = this.store.newModel(data);
                } else {
                    this.media = new Media();
                }
            },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this.return();
                });
    }

    delete(media: Media) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            media.deleting = true;

            this.busy = true;
            this.store.delete(media)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
                    }
                );
        }
    }

    submit(media: Media) {
        if (media.id === null) {
            this.busy = true;
            this.store.add(media)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.creation');
                        alert(msg);
                    }
                );
        } else {
            this.busy = true;
            this.store.update(media)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.update');
                        alert(msg);
                    }
                );
        }
    }

    return() {
        this.busy = false;
        this._location.back();
    }

    isImage(): boolean {
        const mediaName = this.media.name.toLowerCase();

        var isImage: boolean = false;
        if (mediaName.endsWith('.jpg') || mediaName.endsWith('.jpeg')
            || mediaName.endsWith('.png') || mediaName.endsWith('.bmp')
            || mediaName.endsWith('.svg')) {
            isImage = true;
        }

        return isImage;
    }

    publicLink(): string {
        return this.store.publicLink(this.media);
    }

    download() {
        this.store.download(this.media).then((value: {filename: string, data: any}) => {
            const url = window.URL.createObjectURL(value.data);
            window.open(url);
        });
    }

}
