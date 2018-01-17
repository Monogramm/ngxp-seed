import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HomeCommonViewModel } from '../../x-shared/app/home';
import { Logger } from '../../x-shared/app/shared';
import { LoginService } from '../../x-shared/app/login';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [HomeCommonViewModel, LoginService]
})
export class HomeComponent {

    constructor(public cvm: HomeCommonViewModel,
        private _loginService: LoginService,
        private _router: Router) { }

    logoff() {
        if (Logger.isEnabled) {
            Logger.log('logging off and redirecting to login');
        }

        this._loginService.logoff();
        this._router.navigate(['/login']);
    }
}
