import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { LoginService, User } from '../../data';

import { ChangePasswordComponent } from './change-password';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    email: string;

    token: string;

    password: string;

    constructor(public store: LoginService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    sendToken() {
        if (this.email) {
            this.store.sendResetPasswordToken(this.email)
                .then(
                    () => {
                        var msg: string = this._translate.instant('users.message.success.token_sent');
                        alert(msg);
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('users.message.error.send_token');
                        alert(msg);
                    }
                );
        }
    }

    submit() {
        this.store.resetPassword(this.email, this.token, this.password)
            .then(
                () => {
                    this._router.navigate(['']);
                },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('users.message.error.reset_password');
                    alert(msg);
                }
            );
    }

    cancel() {
        this._location.back();
    }

}
