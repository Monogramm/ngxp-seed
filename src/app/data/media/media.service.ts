import { Injectable } from '@angular/core';
import { ResponseContentType } from '@angular/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../../core';
import { Logger, Pagination } from '../../shared';
import { Media, MediaDTO } from './media.model';
import { FileSystemEntity } from 'tns-core-modules/file-system/file-system';

@Injectable()
export class MediaService {
    private basePath: string = 'media';
    private uploadPath: string = this.basePath + '/upload';
    public downloadPath: string = this.basePath + '/download';

    items: BehaviorSubject<Array<Media>> = new BehaviorSubject([]);

    private _allItems: Array<Media> = [];

    constructor(private backendService: BackendService, private worker: WorkerService) {
    }

    load(pagination?: Pagination) {
        if (Logger.isEnabled) {
            Logger.log('loading media...');
        }
        this._allItems.length = 0;

        return this.backendService.load(this.basePath, pagination)
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                var data: Array<any>;
                if (response instanceof Response || typeof response.json !== 'undefined') {
                    data = response.json();
                } else if (response instanceof Array) {
                    data = response;
                } else {
                    throw Error('The loaded result does not match any expected format.');
                }

                data.forEach((rawEntry) => {
                    let newEntry = this.newModel(rawEntry);

                    this._allItems.push(newEntry);
                });

                this.publishUpdates();
            });
    }

    get(id: string) {
        if (Logger.isEnabled) {
            Logger.log('retrieving a media = ' + id);
        }

        return this.backendService
            .getById(this.basePath, id)
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                var data;
                if (response instanceof Response || typeof response.json !== 'undefined') {
                    data = response.json();
                } else if (response instanceof Object) {
                    data = response;
                } else {
                    throw Error('The loaded result does not match any expected format.');
                }

                return data;
            });
    }

    get count(): number {
        return this._allItems.length;
    }

    add(mediaToAdd: Media | MediaDTO) {
        let now: Date = new Date();
        let media: MediaDTO;
        if (mediaToAdd instanceof Media) {
            media = new MediaDTO(
                null,
                mediaToAdd.name,
                mediaToAdd.description,
                mediaToAdd.startDate,
                mediaToAdd.endDate,
                mediaToAdd.path,
                mediaToAdd.resource,
                now,
                this.backendService.userId,
                now,
                this.backendService.userId,
                mediaToAdd.owner || this.backendService.userId
            );
        } else {
            media = mediaToAdd;
        }

        const formData: FormData = new FormData();
        formData.append('files', media.resource, media.name);

        if (Logger.isEnabled) {
            Logger.log('adding a media = ' + formData);
        }

        return this.backendService.push(
            this.uploadPath, formData, [
                { header: 'Content-Type', value: '' },
                { header: 'enctype', value: 'multipart/form-data' }
            ]
        )
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                var data;
                if (response instanceof Response || typeof response.json !== 'undefined') {
                    data = response.json();
                } else {
                    data = response;
                }

                let newEntry = this.newModel(data);

                this._allItems.unshift(newEntry);

                this.publishUpdates();
            });
    }

    update(media: Media) {
        if (Logger.isEnabled) {
            Logger.log('updating a media = ' + media);
        }

        return this.backendService.set(
            this.basePath, media.id, media
        )
            .then(res => res.json())
            .then(data => {
                this.publishUpdates();
            });
    }

    updateSelection(selected: boolean) {
        let indeces: string[] = [];
        this._allItems.forEach((type) => {
            type.selected = selected;
        });
        this.publishUpdates();
    }

    delete(media: Media) {
        if (Logger.isEnabled) {
            Logger.log('deleting a media = ' + media.name);
        }

        return this.backendService
            .remove(
                this.basePath, media.id
            )
            .then(res => res.json())
            .then(data => {
                let index = this._allItems.indexOf(media);
                this._allItems.splice(index, 1);
                this.publishUpdates();
            });
    }

    deleteSelection() {
        let indeces: string[] = [];
        this._allItems.forEach((media) => {
            if (media.selected) {
                indeces.push(media.id);
            }
        });
        if (indeces.length === 0) {
            return null;
        }

        return this.backendService.removeAll(
            this.basePath, indeces
        )
            .then(res => res.json())
            .then(data => {
                this._allItems.forEach((media) => {
                    if (media.selected) {
                        let index = this._allItems.indexOf(media);
                        this._allItems.splice(index, 1);
                        media.selected = false;
                    }
                });
                this.publishUpdates();
            });
    }

    public newModel(data?: any): Media {
        return new Media(
            data.id || null,
            data.name,
            data.description,
            data.startDate ? new Date(data.startDate) : null,
            data.endDate ? new Date(data.endDate) : null,
            data.path,
            null,
            data.selected || false,
            data.deleted || false,
            data.deleting || false,
            data.createdAt ? new Date(data.createdAt) : null,
            data.createdBy || this.backendService.userId,
            data.modifiedAt ? new Date(data.modifiedAt) : null,
            data.modifiedBy || null,
            data.owner || this.backendService.userId
        );
    }

    private publishUpdates() {
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        this.worker.run(() => {
            // must emit a *new* value (immutability!)
            this.items.next([...this._allItems]);
        });
    }

    publicLink(mediaToDownload: Media | MediaDTO): string {
        return this.backendService.config.apiURL + this.downloadPath + '/' + mediaToDownload.id;
    }

    download(mediaToDownload: Media | MediaDTO) {
        if (Logger.isEnabled) {
            Logger.log('downloading a media = ' + mediaToDownload);
        }

        return this.backendService
            .getById(
                this.downloadPath, mediaToDownload.id,
                [
                    { header: 'responseType', value: 'blob' }
                ],
                { responseType: ResponseContentType.Blob }
            )
            .then((response: Response) => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                return {
                    filename: mediaToDownload.name,
                    data: response.blob()
                };
            });
    }
}