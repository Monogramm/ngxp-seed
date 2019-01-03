import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Logger } from '../../shared/';
import { LoginService, User, UserService } from '../../data';

@Component({
    selector: 'mg-register',
    moduleId: module.id,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    user: User;

    token: string;

    constructor(public store: LoginService,
        public userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params.pipe(
            switchMap((params: Params) => this.userService.get(params['id'])))
            .subscribe((data: any) => {
                this.user = this.userService.newModel(data);
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
        if (this.user.email) {
            this.store.sendResetPasswordToken(this.user.email)
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
        if (!!!this.token) {
            alert('The token cannot be empty!');
            return;
        }
        this.store.verify(this.user.id, this.token)
            .then(
            () => {
                this._router.navigate(['']);
            },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('Could not verify the account. Check entered information or resend token.');
            }
            );
    }

    cancel() {
        this._location.back();
    }

    get valid(): boolean {
        return !!!this.token;
    }

}
