import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { LoginService, User } from '../../data';

import { ChangePasswordComponent } from './change-password';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    email: string;
    token: string;
    password: string;
    busy = false;

    constructor(public store: LoginService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    sendToken() {
        if (this.email) {
            this.busy = true;
            this.store.sendResetPasswordToken(this.email)
                .then(
                    () => {
                        this.busy = false;
                        const msg: string = this._translate.instant('users.message.success.token_sent');
                        alert(msg);
                    },
                    (error) => {
                        this.busy = false;
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        const msg: string = this._translate.instant('users.message.error.send_token');
                        alert(msg);
                    }
                );
        }
    }

    submit() {
        this.busy = true;
        this.store.resetPassword(this.email, this.token, this.password)
            .then(
                () => {
                    this.busy = false;
                    this._router.navigate(['']);
                },
                (error) => {
                    this.busy = false;
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    const msg: string = this._translate.instant('users.message.error.reset_password');
                    alert(msg);
                }
            );
    }

    return() {
        this.busy = false;
        this._location.back();
    }

}
