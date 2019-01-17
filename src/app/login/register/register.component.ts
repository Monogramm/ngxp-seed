import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { LoginService, User, UserService } from '../../data';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    user: User;

    token: string;

    constructor(public store: LoginService,
        public userService: UserService,
        private _translate: TranslateService,
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
                    var msg: string = this._translate.instant('register.message.error.load_profile');
                    alert(msg);
                    this._location.back();
                }
            );
    }

    sendToken() {
        if (this.user.email) {
            this.store.sendVerificationToken(this.user.email)
                .then(
                    () => {
                        var msg: string = this._translate.instant('register.message.success.token_sent');
                        alert(msg);
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('register.message.error.send_token');
                        alert(msg);
                    }
                );
        }
    }

    submit() {
        if (!!!this.token) {
            var msg: string = this._translate.instant('register.message.warning.empty_token');
            alert(msg);
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
                    var msg: string = this._translate.instant('register.message.error.verification');
                    alert(msg);
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
