import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../../core';
import { Logger, Pagination } from '../../shared';
import { Type, TypeDTO } from './type.model';

@Injectable()
export class TypeService {
    private basePath: string = 'types';

    items: BehaviorSubject<Array<Type>> = new BehaviorSubject([]);

    private _allItems: Array<Type> = [];

    constructor(private backendService: BackendService,
        private worker: WorkerService) {
    }

    load(pagination?: Pagination) {
        if (Logger.isEnabled) {
            Logger.log('loading types...');
        }
        this._allItems.length = 0;

        return this.backendService.load(this.basePath, pagination)
            .then(
                (response) => {
                    if (Logger.isEnabled) {
                        Logger.log('response = ');
                        Logger.dir(response);
                    }

                    var data;
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
                },
                (error: Promise<Response>) => {
                    if (Logger.isEnabled) {
                        Logger.log('Types not loaded');
                    }
                    this.publishUpdates();
                    return Promise.reject(error);
                }
            );
    }

    get(id: string) {
        if (Logger.isEnabled) {
            Logger.log('retrieving a type = ' + id);
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

    add(typeToAdd: string | Type | TypeDTO) {
        let now = new Date();
        let type;
        if (typeof typeToAdd === 'string') {
            type = new TypeDTO(
                null,
                typeToAdd,
                now,
                this.backendService.userId,
                now,
                this.backendService.userId,
                this.backendService.userId
            );
        } else if (typeToAdd instanceof Type) {
            type = new TypeDTO(
                null,
                typeToAdd.name,
                now,
                this.backendService.userId,
                now,
                this.backendService.userId,
                typeToAdd.owner || this.backendService.userId
            );
        } else {
            type = typeToAdd;
        }
        let body = JSON.stringify(type);

        if (Logger.isEnabled) {
            Logger.log('adding a type = ' + body);
        }

        return this.backendService.push(
            this.basePath, body
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

    update(type: Type) {
        if (Logger.isEnabled) {
            Logger.log('updating a type = ' + type);
        }

        return this.backendService.set(
            this.basePath, type.id, type
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

    delete(type: Type) {
        if (Logger.isEnabled) {
            Logger.log('deleting a type = ' + type.name);
        }

        return this.backendService
            .remove(
                this.basePath, type.id
            )
            .then(res => res.json())
            .then(data => {
                let index = this._allItems.indexOf(type);
                this._allItems.splice(index, 1);
                this.publishUpdates();
            });
    }

    deleteSelection() {
        let indeces: string[] = [];
        this._allItems.forEach((type) => {
            if (type.selected) {
                indeces.push(type.id);
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
                this._allItems.forEach((type) => {
                    if (type.selected) {
                        let index = this._allItems.indexOf(type);
                        this._allItems.splice(index, 1);
                        type.selected = false;
                    }
                });
                this.publishUpdates();
            });
    }

    public newModel(data?: any): Type {
        return new Type(
            data.id || null,
            data.name,
            data.selected || false,
            data.deleted || false,
            data.deleting || false,
            data.createdAt ? new Date(data.createdAt) : null,
            data.createdBy || null,
            data.modifiedAt ? new Date(data.modifiedAt) : null,
            data.modifiedBy || null,
            data.owner || null
        );
    }

    private publishUpdates() {
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        this.worker.run(() => {
            // must emit a *new* value (immutability!)
            this.items.next([...this._allItems]);
        });
    }
}