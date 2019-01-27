import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Logger } from '../../shared/';
import { User, UserService } from '../../data';

import { ChangePasswordComponent } from './change-password';

@Component({
    selector: 'user',
    templateUrl: './user-password.component.html',
    styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit {
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
            });
    }

    submit(user: User) {
        var msg: string = this._translate.instant('app.message.confirm.password');
        if (confirm(msg)) {
            this.store.update(user)
                .then(
                () => {
                    this._router.navigate(['/']);
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
