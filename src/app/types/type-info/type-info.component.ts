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

    constructor(public store: TypeService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => this.store.get(params['id'])))
            .subscribe((data: any) => {
                this.type = this.store.newModel(data);
            },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this._location.back();
                });
    }

    delete(type: Type) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            type.deleting = true;

            this.store.delete(type)
                .then(
                    () => {
                        this._location.back();
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
            this.store.add(type.name)
                .then(
                    () => {
                        this._location.back();
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
            this.store.update(type)
                .then(
                    () => {
                        this._location.back();
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

    cancel() {
        this._location.back();
    }

}
