import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { Role, RoleService } from '../../data';

import { RoleDetailsComponent } from './role-details';

@Component({
    selector: 'role-info',
    templateUrl: './role-info.component.html',
    styleUrls: ['./role-info.component.scss']
})
export class RoleInfoComponent implements OnInit {
    role: Role;

    constructor(public store: RoleService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => this.store.get(params['id'])))
            .subscribe((data: any) => {
                this.role = this.store.newModel(data);
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

    delete(role: Role) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            role.deleting = true;

            this.store.delete(role)
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

    submit(role: Role) {
        if (role.id === null) {
            this.store.add(role.name)
                .then(
                    () => { this._location.back(); },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.creation');
                        alert(msg);
                    }
                );
        } else {
            this.store.update(role)
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
