import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AppService } from '../app.service';
import { Logger } from '../shared';
import { User, LoginService } from '../data';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    user: User;
    isLoggingIn = true;
    isAuthenticating = false;

    tosAccepted = false;

    public readonly appName: string = AppService.APP_NAME;

    constructor(
        private loginService: LoginService,
        private _translate: TranslateService,
        private router: Router) {
        this.user = new User();
    }

    submit() {
        if (!this.user.isValidEmail()) {
            const msg: string = this._translate.instant('login.message.warning.valid_email');
            alert(msg);
            return;
        }

        this.isAuthenticating = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.signUp();
        }
    }

    login() {
        this.loginService.login(this.user)
            .then(
                (user) => {
                    this.isAuthenticating = false;

                    if (user.verified) {
                        this.router.navigate(['']);
                    } else {
                        this.router.navigate(['register', user.id]);
                        return false;
                    }
                },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.log('Login error');
                        Logger.dir(error);
                    }
                    this.isAuthenticating = false;
                    const msg: string = this._translate.instant('login.message.error.login');
                    alert(msg);
                }
            );
    }

    signUp() {
        if (!!!this.user.username) {
            this.user.username = this.user.email.substr(0, this.user.email.indexOf('@'));
        }

        if (!!!this.tosAccepted) {
            const msg: string = this._translate.instant('login.message.warning.accept_tos');
            alert(msg);
            return;
        }

        this.loginService.register(this.user)
            .then(
                () => {
                    const msg: string = this._translate.instant('login.message.success.signup');
                    alert(msg);
                    this.isAuthenticating = false;
                    this.toggleDisplay();
                },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.log('Registration error');
                        Logger.dir(error);
                    }
                    this.isAuthenticating = false;
                    const msg: string = this._translate.instant('login.message.error.signup');
                    alert(msg);
                }
            );
    }

    forgotPassword() {
        this.router.navigate(['reset-password']);
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
    }
}
