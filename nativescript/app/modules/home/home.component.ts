import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';

import { Logger } from '../../x-shared/app/shared';
import { HomeCommonViewModel, HomeService } from '../../x-shared/app/home';

import { LoginService } from '../../x-shared/app/login';

@Component({
    selector: 'mg-home',
    templateUrl: 'modules/home/home.component.html',
    styleUrls: ['modules/home/home.component.css'],
    providers: [HomeCommonViewModel, HomeService, LoginService]
})
export class HomeComponent {

    constructor(public cvm: HomeCommonViewModel,
        private _loginService: LoginService,
        private _router: Router) {
        /*
        if (Logger.isEnabled) {
            Logger.log('available pages: ');
            Logger.dir(this.cvm.availablePages);
        }
        */
    }

    logoff() {
        if (Logger.isEnabled) {
            Logger.log('logging off and redirecting to login');
        }

        this._loginService.logoff();
        this._router.navigate(['/login']);
    }
}
