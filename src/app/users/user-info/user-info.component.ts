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

    constructor(public store: UserService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => this.store.get(params['id'])))
            .subscribe((data: any) => {
                this.user = this.store.newModel(data);
            },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this._location.back();
                }
            );
    }

    delete(user: User) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            user.deleting = true;

            this.store.delete(user)
                .then(
                    () => { },
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

    submit(user: User) {
        var msgCreate: string = this._translate.instant('app.message.confirm.create');
        var msgUpdate: string = this._translate.instant('app.message.confirm.update');
        if (user.id === null && confirm(msgCreate)) {
            this.store.add(user)
                .then(
                    () => { },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.creation');
                        alert(msg);
                    }
                );
        } else if (confirm(msgUpdate)) {
            this.store.update(user)
                .then(
                    () => { },
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
