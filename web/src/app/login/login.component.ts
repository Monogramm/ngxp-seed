import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppResources } from '../../x-shared/app/shared/app-resources';
import { User } from '../../x-shared/app/users/user.model';
import { LoginService } from '../../x-shared/app/login'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    user: User;
    isLoggingIn = true;
    isAuthenticating = false;

    readonly appName = AppResources.appName.toUpperCase();

    constructor(
        private _loginService: LoginService,
        private _router: Router) {
        this.user = new User();
    }

    submit() {
        if (!this.user.isValidEmail()) {
            alert('Enter a valid email address');
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
        this._loginService.login(this.user)
            .then(
            () => {
                this.isAuthenticating = false;

                if (this.user.verified) {
                    this._router.navigate(['']);
                } else {
                    this._router.navigate(['register', this.user.id]);
                }
            },
            () => {
                alert('Unfortunately we were not able to log you in to the system');
                this.isAuthenticating = false;
            }
            );
    }

    signUp() {
        if (!!!this.user.username) {
            this.user.username = this.user.email.substr(0, this.user.email.indexOf('@'));
        }

        this._loginService.register(this.user)
            .then(
            () => {
                alert('Your account was successfully created. An email has been sent to activate your account.');
                this.isAuthenticating = false;
                this.toggleDisplay();
            },
            (error) => {
                // TODO: Verify this works
                if (error.match(/same user/)) {
                    alert('This email address is already in use.');
                } else {
                    alert('Unfortunately we were unable to create your account.');
                }
                this.isAuthenticating = false;
            }
            );
    }

    forgotPassword() {
        this._router.navigate(['reset_password']);
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
    }
}
