import { Component } from '@angular/core';

import { HomeCommonViewModel } from '../data/home';
import { Logger } from '../shared';
import { LoginService } from '../data/login';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [HomeCommonViewModel, LoginService]
})
export class HomeComponent {

    constructor(public cvm: HomeCommonViewModel,
        private _loginService: LoginService) { }

    logoff() {
        if (Logger.isEnabled) {
            Logger.log('logging off and redirecting to login');
        }

        this._loginService.logout();
    }
}
