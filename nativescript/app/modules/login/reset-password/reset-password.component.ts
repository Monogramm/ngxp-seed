import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Logger } from '../../../x-shared/app/shared';
import { LoginService } from '../../../x-shared/app/login';
import { User } from '../../../x-shared/app/users';

import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
    selector: 'mg-reset-password',
    moduleId: module.id,
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
    email: string;

    token: string;

    password: string;

    constructor(public store: LoginService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    sendToken() {
        if (this.email) {
            this.store.sendResetPasswordToken(this.email)
                .then(
                () => { alert('Password reset token sent to your email address. Check your mail box and spams.') },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while sending reset password token.');
                }
                );
        }
    }

    submit() {
        this.store.resetPassword(this.email, this.token, this.password)
            .then(
            () => { },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while resetting password.');
            }
            );
    }

    cancel() {
        this._location.back();
    }

}
