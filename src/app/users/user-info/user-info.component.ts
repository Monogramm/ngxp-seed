import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { User, UserService } from '../../data';

import { UserDetailsComponent } from './user-details';

@Component({
    selector: 'user',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
    user: User;
    busy: boolean = false;

    constructor(public store: UserService,
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
                    this.user = this.store.newModel(data);
                } else {
                    this.user = new User();
                }
            },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this.return();
                }
            );
    }

    delete(user: User) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            user.deleting = true;

            this.busy = true;
            this.store.delete(user)
                .then(
                    () => {
                        this.return();
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
                    }
                );
        }
    }

    submit(user: User) {
        if (user.id === null) {
            var msgCreate: string = this._translate.instant('app.message.confirm.create');
            if (confirm(msgCreate)) {
                this.busy = true;
                this.store.add(user)
                    .then(
                        () => {
                            this.return();
                        },
                        (error) => {
                            this.busy = false;
                            if (Logger.isEnabled) {
                                Logger.dir(error);
                            }
                            var msg: string = this._translate.instant('app.message.error.creation');
                            alert(msg);
                        }
                    );
            }
        } else {
            var msgUpdate: string = this._translate.instant('app.message.confirm.update');
            if (confirm(msgUpdate)) {
                this.busy = true;
                this.store.update(user)
                    .then(
                        () => {
                            this.return();
                        },
                        (error) => {
                            this.busy = false;
                            if (Logger.isEnabled) {
                                Logger.dir(error);
                            }
                            var msg: string = this._translate.instant('app.message.error.update');
                            alert(msg);
                        }
                    );
            }
        }
    }

    return() {
        this.busy = false;
        this._location.back();
    }

}
