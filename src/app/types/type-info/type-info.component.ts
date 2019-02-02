import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { Type, TypeService } from '../../data';

import { TypeDetailsComponent } from './type-details';

@Component({
    selector: 'type-info',
    templateUrl: './type-info.component.html',
    styleUrls: ['./type-info.component.scss']
})
export class TypeInfoComponent implements OnInit {
    type: Type;
    busy: boolean = false;

    constructor(public store: TypeService,
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
                    this.type = this.store.newModel(data);
                } else {
                    this.type = new Type();
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

    delete(type: Type) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            type.deleting = true;

            this.busy = true;
            this.store.delete(type)
                .then(
                    () => {
                        this.return();
                    },
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

    submit(type: Type) {
        if (type.id === null) {
            this.busy = true;
            this.store.add(type.name)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.creation');
                        alert(msg);
                    }
                );
        } else {
            this.busy = true;
            this.store.update(type)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
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

}
