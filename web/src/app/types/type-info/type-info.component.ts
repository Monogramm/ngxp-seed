import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Logger } from '../../../x-shared/app/shared';
import { Type, TypeService } from '../../../x-shared/app/types';

import { TypeDetailsComponent } from './type-details';

@Component({
    selector: 'type-info',
    templateUrl: './type-info.component.html',
    styleUrls: ['./type-info.component.scss']
})
export class TypeInfoComponent implements OnInit {
    type: Type;

    constructor(public store: TypeService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params
            .switchMap((params: Params) => this.store.get(params['id']))
            .subscribe((data: any) => {
                this.type = this.store.newModel(data);
            },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while loading a type.');
                this._location.back();
            });
    }

    delete(type: Type) {
        if (confirm('Confirm deletion of type "' + type.name + '" ?')) {
            type.deleting = true;

            this.store.delete(type)
                .then(
                () => { },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while deleting a type.');
                }
                );
        }
    }

    submit(type: Type) {
        if (type.id === null) {
            this.store.add(type.name)
                .then(
                () => { this._location.back() },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while adding an type.');
                }
                );
        } else {
            this.store.update(type)
                .then(
                () => { this._location.back() },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while updating a type.');
                }
                );
        }
    }

    cancel() {
        this._location.back();
    }

}
