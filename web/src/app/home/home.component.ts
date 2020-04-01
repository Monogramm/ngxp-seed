import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HomeCommonViewModel } from '@xapp/home';

import { AppResources } from '@xapp/shared/app-resources';
import { Logger } from '@xapp/shared';
import { LoginService } from '@xapp/login';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [HomeCommonViewModel, LoginService]
})
export class HomeComponent {

    constructor(public cvm: HomeCommonViewModel,
        private _loginService: LoginService,
        private _router: Router) { }

    isLoggedIn(): boolean {
        return this._loginService.isLoggedIn();
    }

    logoff() {
        if (Logger.isEnabled) {
            Logger.log('logging off and redirecting to login');
        }

        this._loginService.logout();
        this._router.navigate(['/login']);
    }
}
