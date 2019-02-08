import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared';
import { Media, MediaService, MediaDTO } from '../../data';

import { MediaDetailsComponent } from './media-details';

@Component({
    selector: 'app-media-info',
    templateUrl: './media-info.component.html',
    styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit {
    media: Media;
    busy = false;

    constructor(public store: MediaService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => {
                this.busy = true;
                const entityId = params['id'];
                if (entityId) {
                    return this.store.get(entityId);
                } else {
                    return Observable.create((observer) => {
                        observer.next(null);
                    });
                }
            }))
            .subscribe((data: HttpResponse<MediaDTO>) => {
                this.busy = false;
                if (data && data.body) {
                    this.media = this.store.newModel(data.body);
                } else {
                    this.media = new Media();
                }
            },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    const errMsg: string = this._translate.instant('app.message.error.loading');
                    alert(errMsg);
                    this.return();
                });
    }

    delete(media: Media) {
        const msg: string = this._translate.instant('app.message.confirm.delete');
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
                        const errMsg: string = this._translate.instant('app.message.error.deletion');
                        alert(errMsg);
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
                        const errMsg: string = this._translate.instant('app.message.error.creation');
                        alert(errMsg);
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
                        const errMsg: string = this._translate.instant('app.message.error.update');
                        alert(errMsg);
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

        let isImage = false;
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
        this.store.download(this.media).then((value: { filename: string, data: any }) => {
            const blob = value.data;
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        });
    }

}
