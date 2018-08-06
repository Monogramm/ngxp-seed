import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseOptions } from '@angular/http';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';


import { BackendService } from '../core';
import { Logger, Base64, Pagination } from '../shared';
import { User } from '../users/user.model';

@Injectable()
export class LoginService {
    private basePath: string = 'Users/register';

    private basePathOAuth: string = 'oauth/token';

    private basePathResetPwd: string = 'Users/reset_password';

    private basePathSendVerif: string = 'Users/send_verification';

    private basePathVerify: string = 'Users/verify';

    constructor(private backendService: BackendService) {
    }

    isLoggedIn(): boolean {
        return this.backendService.isLoggedIn();
    }

    register(user: User) {
        let body = JSON.stringify({
            username: user.username,
            email: user.email,
            password: user.password,
            matching_password: user.password
        });

        if (Logger.isEnabled) {
            Logger.log('registering in user = ' + body);
        }

        return this.backendService.push(
            this.basePath, body
        );
    }

    login(user: User) {
        let body = JSON.stringify({
            username: user.email,
            email: user.email,
            password: user.password,
            client_id: this.backendService.clientId,
            client_secret: this.backendService.clientSecret,
            grant_type: 'password'
        });

        if (Logger.isEnabled) {
            Logger.log('logging in user = ' + user.email);
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
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                var data;
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
                    // Update user
                    user.verified = data.verified;
                    user.id = data.principal_id;

                    this.backendService.token = data.access_token;
                    var expirationTime: number = Date.now() + data.expires_in;
                    this.backendService.tokenExpiration = new Date(expirationTime);
                    
                    this.backendService.refreshToken = data.refresh_token;

                    this.backendService.userId = data.principal_id;
                    this.backendService.userRoles = data.roles;
                }
            });
    }

    logoff() {
        if (Logger.isEnabled) {
            Logger.log('Logging off');
        }

        // FIXME We get a 401 on token revocation
        // Logout from the backend (to prevent future usage of old tokens)
        //this.backendService.remove(this.basePathOAuth, null);

        // Clear backend services info
        this.backendService.clear();
    }

    sendResetPasswordToken(email: string) {
        let body = JSON.stringify({
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
        let body = JSON.stringify({
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
        let body = JSON.stringify({
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
        let body = JSON.stringify({
            token: token
        });

        if (Logger.isEnabled) {
            Logger.log('verifiying user = ' + body);
        }

        return this.backendService.set(
            this.basePathVerify, id, body
        );
    }
}
