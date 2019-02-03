import { Component } from '@angular/core';

import { HomeCommonViewModel, HomeService } from '../data/home';
import { Logger } from '../shared';
import { LoginService } from '../data/login';

@Component({
    selector: 'app-tns-home',
    templateUrl: './home/home.component.html',
    styleUrls: ['./home/home.component.css'],
    providers: [HomeCommonViewModel, HomeService, LoginService]
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
