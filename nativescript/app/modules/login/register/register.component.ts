import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Logger } from '../../../x-shared/app/shared';
import { LoginService } from '../../../x-shared/app/login';
import { User, UserService } from '../../../x-shared/app/users';

import { VerifyAccountComponent } from './verify-account';

@Component({
    selector: 'mg-register',
    moduleId: module.id,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    user: User;

    email: string;

    token: string;

    constructor(public store: LoginService,
        public userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params
            .switchMap((params: Params) => this.userService.get(params['id']))
            .subscribe((data: any) => {
                this.user = this.userService.newModeladd(data);
            },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while loading the profile information.');
                this._location.back();
            }
            );
    }

    sendToken() {
        if (this.email) {
            this.store.sendResetPasswordToken(this.email)
                .then(
                () => { alert('Account verification token sent to your email address. Check your mail box and spams.') },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while sending account verification token.');
                }
                );
        }
    }

    submit() {
        this.store.verify(this.user.id, this.token)
            .then(
            () => {
                this._router.navigate(['']);
            },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while verifying the account.');
            }
            );
    }

    cancel() {
        this._location.back();
    }

}
