import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AppService } from '../app.service';
import { Logger } from '../shared';
import { User, LoginService } from '../data'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    user: User;
    isLoggingIn = true;
    isAuthenticating = false;

    public readonly appName: string = AppService.APP_NAME;

    constructor(
        private loginService: LoginService,
        private router: Router) {
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
                    alert('Unfortunately we were not able to log you into the system');
                }
            );
    }

    signUp() {
        if (!!!this.user.username) {
            this.user.username = this.user.email.substr(0, this.user.email.indexOf('@'));
        }

        this.loginService.register(this.user)
            .then(
                () => {
                    alert('Your account was successfully created. An email has been sent to activate your account.');
                    this.isAuthenticating = false;
                    this.toggleDisplay();
                },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.log('Registration error');
                        Logger.dir(error);
                    }
                    this.isAuthenticating = false;
                    // TODO: Verify this works
                    if (error && error._body) {
                        var body = error._body;
                        if (body.match(/same user/)) {
                            alert('This email address is already in use.');
                        } else {
                            alert('An error occurred while creating your account: ' + body);
                        }
                    } else {
                        alert('Unfortunately we were unable to create your account.');
                    }
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
