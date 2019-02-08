import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Logger } from '../../shared/';
import { User, UserDTO, UserService } from '../../data';

import { ChangePasswordComponent } from './change-password';

@Component({
    selector: 'app-user-password',
    templateUrl: './user-password.component.html',
    styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit {
    user: User;
    busy = false;

    constructor(public store: UserService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => {
                this.busy = true;
                return this.store.get(params['id']);
            }))
            .subscribe((data: HttpResponse<UserDTO>) => {
                this.busy = false;
                this.user = this.store.newModel(data.body);
            });
    }

    submit(user: User) {
        const msg: string = this._translate.instant('app.message.confirm.password');
        if (confirm(msg)) {
            this.busy = true;
            this.store.update(user)
                .then(
                    () => {
                        this.busy = false;
                        this._router.navigate(['/']);
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
