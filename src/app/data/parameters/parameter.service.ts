import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../../core';
import { Logger, Pagination } from '../../shared';
import { Parameter, ParameterDTO } from './parameter.model';

@Injectable()
export class ParameterService {
    private readonly basePath = 'parameters';

    items: BehaviorSubject<Array<Parameter>> = new BehaviorSubject([]);

    private _allItems: Array<Parameter> = [];

    constructor(private backendService: BackendService, private worker: WorkerService) {
    }

    load(pagination?: Pagination) {
        if (Logger.isEnabled) {
            Logger.log('loading parameters...');
        }
        this._allItems.length = 0;

        return this.backendService.load(this.basePath, pagination)
            .then(
                (response) => {
                    if (Logger.isEnabled) {
                        Logger.log('response = ');
                        Logger.dir(response);
                    }

                    let data: Array<any>;
                    if (response instanceof Response || typeof response.json !== 'undefined') {
                        data = response.json();
                    } else if (response instanceof Array) {
                        data = response;
                    } else {
                        throw Error('The loaded result does not match any expected format.');
                    }

                    data.forEach((rawEntry) => {
                        const newEntry = this.newModel(rawEntry);

                        this._allItems.push(newEntry);
                    });

                    this.publishUpdates();
                },
                (error: Promise<Response>) => {
                    if (Logger.isEnabled) {
                        Logger.log('Parameters not loaded');
                    }
                    this.publishUpdates();
                    return Promise.reject(error);
                }
            );
    }

    get(id: string) {
        if (Logger.isEnabled) {
            Logger.log('retrieving a parameter = ' + id);
        }

        return this.backendService
            .getById(this.basePath, id)
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                let data;
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

    add(parameterToAdd: Parameter | ParameterDTO) {
        const now = new Date();
        let parameter: ParameterDTO;
        if (parameterToAdd instanceof Parameter) {
            parameter = new ParameterDTO(
                null,
                parameterToAdd.name,
                parameterToAdd.description,
                parameterToAdd.type,
                parameterToAdd.value,
                now,
                this.backendService.userId,
                now,
                this.backendService.userId,
                parameterToAdd.owner || this.backendService.userId
            );
        } else {
            parameter = parameterToAdd;
        }
        const body = JSON.stringify(parameter);

        if (Logger.isEnabled) {
            Logger.log('adding a parameter = ' + body);
        }

        return this.backendService.push(
            this.basePath, body
        )
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                let data;
                if (response instanceof Response || typeof response.json !== 'undefined') {
                    data = response.json();
                } else {
                    data = response;
                }

                const newEntry = this.newModel(data);

                this._allItems.unshift(newEntry);

                this.publishUpdates();
            });
    }

    update(parameter: Parameter) {
        if (Logger.isEnabled) {
            Logger.log('updating a parameter = ' + parameter);
        }

        return this.backendService.set(
            this.basePath, parameter.id, parameter
        )
            .then(res => res.json())
            .then(data => {
                this.publishUpdates();
            });
    }

    updateSelection(selected: boolean) {
        const indeces: string[] = [];
        this._allItems.forEach((type) => {
            type.selected = selected;
        });
        this.publishUpdates();
    }

    delete(parameter: Parameter) {
        if (Logger.isEnabled) {
            Logger.log('deleting a parameter = ' + parameter.name);
        }

        return this.backendService
            .remove(
                this.basePath, parameter.id
            )
            .then(res => res.json())
            .then(data => {
                const index = this._allItems.indexOf(parameter);
                this._allItems.splice(index, 1);
                this.publishUpdates();
            });
    }

    deleteSelection() {
        const indeces: string[] = [];
        this._allItems.forEach((parameter) => {
            if (parameter.selected) {
                indeces.push(parameter.id);
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
                this._allItems.forEach((parameter) => {
                    if (parameter.selected) {
                        const index = this._allItems.indexOf(parameter);
                        this._allItems.splice(index, 1);
                        parameter.selected = false;
                    }
                });
                this.publishUpdates();
            });
    }

    public newModel(data?: any): Parameter {
        return new Parameter(
            data.id || null,
            data.name,
            data.description,
            data.type,
            data.value,
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
