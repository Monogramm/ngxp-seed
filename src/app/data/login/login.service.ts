import { Injectable } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs';

import { Router } from '../../common';
import { BackendService } from '../../core';
import { Logger, Base64 } from '../../shared';
import { User } from '../users/user.model';

@Injectable()
export class LoginService {
    private readonly basePathOAuth = 'oauth/token';

    private readonly basePathRegister = 'users/register';
    private readonly basePathResetPwd = 'users/reset_password';
    private readonly basePathSendVerif = 'users/send_verification';
    private readonly basePathVerify = 'users/verify';

    constructor(private backendService: BackendService,
        private router: Router) {
    }

    currentUser(): Observable<User> {
        return this.backendService.currentUser;
    }
    isLoggedIn(): boolean {
        return this.backendService.isLoggedIn();
    }

    register(user: User) {
        const body = JSON.stringify({
            username: user.username,
            email: user.email,
            password: user.password,
            matching_password: user.password
        });

        if (Logger.isEnabled) {
            Logger.log('Registering user = ' + body);
        }

        return this.backendService.push(
            this.basePathRegister, body
        );
    }

    login(user: User): Promise<User> {
        const body = JSON.stringify({
            username: user.email,
            email: user.email,
            password: user.password,
            client_id: this.backendService.clientId,
            client_secret: this.backendService.clientSecret,
            grant_type: 'password'
        });

        if (Logger.isEnabled) {
            Logger.log('Login user = ' + user.email);
        }

        return this.backendService.push(
            this.basePathOAuth, body,
            [
                {
                    header: 'Authorization',
                    value: 'Basic ' + Base64.btoa(this.backendService.clientId + ':' + this.backendService.clientSecret)
                }
            ]
        )
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('Login response = ');
                    Logger.dir(response);
                }

                let data: any;
                if (response instanceof Response || typeof response.json !== 'undefined') {
                    data = response.json();
                } else {
                    data = response;
                }

                if (data) {
                    if (Logger.isEnabled) {
                        Logger.log('User logged in');
                        Logger.dir(response);
                    }
                    // Authentify user against login response
                    return this.backendService.authentifyUser(data);
                }
                return null;
            });
    }

    logout() {
        if (Logger.isEnabled) {
            Logger.log('Logging off');
        }

        // FIXME We get a 401 on token revocation
        // Logout from the backend (to prevent future usage of old tokens)
        // this.backendService.remove(this.basePathOAuth, null);

        // Clear backend services info
        this.backendService.clear();
        this.router.navigate(['/login'], { replaceUrl: true } as NavigationExtras);
    }

    sendResetPasswordToken(email: string) {
        const body = JSON.stringify({
            email: email
        });

        if (Logger.isEnabled) {
            Logger.log('sending reset password token = ' + body);
        }

        return this.backendService.push(
            this.basePathResetPwd, body
        );
    }

    resetPassword(email: string, token: string, password: string) {
        const body = JSON.stringify({
            email: email,
            token: token,
            password: password,
            matching_password: password
        });

        if (Logger.isEnabled) {
            Logger.log('resetting user password = ' + body);
        }

        return this.backendService.set(
            this.basePathResetPwd, '', body
        );
    }

    sendVerificationToken(email: string) {
        const body = JSON.stringify({
            email: email
        });

        if (Logger.isEnabled) {
            Logger.log('sending verification token = ' + body);
        }

        return this.backendService.push(
            this.basePathSendVerif, body
        );
    }

    verify(id: string, token: string) {
        const body = token;

        if (Logger.isEnabled) {
            Logger.log('verifiying user = ' + body);
        }

        return this.backendService.set(
            this.basePathVerify, id, body
        );
    }
}
