import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseOptions } from '@angular/http';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { WorkerService, BackendService } from '../core';
import { Logger, Pagination } from '../shared';
import { Parameter, ParameterDTO } from './parameter.model';

@Injectable()
export class ParameterService {
    private basePath: string = 'Parameters';

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
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                var data: Array<any>;
                if (response instanceof Response || typeof response.json !== 'undefined') {
                    data = response.json();
                } else if (response instanceof Object) {
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
            Logger.log('retrieving a parameter = ' + id);
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

    add(parameterToAdd: string | Parameter | ParameterDTO, parameterDescription?: string, parameterType?: string, parameterValue?: string) {
        let now = new Date();
        let parameter;
        if (typeof parameterToAdd === 'string') {
            parameter = new ParameterDTO(
                null,
                parameterToAdd,
                parameterDescription,
                parameterType,
                parameterValue,
                now,
                this.backendService.userId,
                now,
                this.backendService.userId,
                this.backendService.userId
            );
        } else if (parameterToAdd instanceof Parameter) {
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
        let body = JSON.stringify(parameter);

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
        let indeces: string[] = [];
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
                let index = this._allItems.indexOf(parameter);
                this._allItems.splice(index, 1);
                this.publishUpdates();
            });
    }

    deleteSelection() {
        let indeces: string[] = [];
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
                        let index = this._allItems.indexOf(parameter);
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