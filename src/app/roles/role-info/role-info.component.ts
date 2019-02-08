import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { Role, RoleService, RoleDTO } from '../../data';

import { RoleDetailsComponent } from './role-details';

@Component({
    selector: 'app-role-info',
    templateUrl: './role-info.component.html',
    styleUrls: ['./role-info.component.scss']
})
export class RoleInfoComponent implements OnInit {
    role: Role;
    busy = false;

    constructor(public store: RoleService,
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
            .subscribe((data: HttpResponse<RoleDTO>) => {
                this.busy = false;
                if (data && data.body) {
                    this.role = this.store.newModel(data.body);
                } else {
                    this.role = new Role();
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

    delete(role: Role) {
        const msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            role.deleting = true;

            this.busy = true;
            this.store.delete(role)
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

    submit(role: Role) {
        if (role.id === null) {
            this.busy = true;
            this.store.add(role.name)
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
            this.store.update(role)
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

}
