import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from './app.service';
import { LoginService } from './data/login';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public readonly appName: string = AppService.APP_NAME;

    title: string = '';

    constructor(
        private _appService: AppService,
        private _titleService: Title,
        private _loginService: LoginService,
        private _router: Router) {

        // emitting appready event, which will remove pre-bootstrap-loader screen.
        document.dispatchEvent(new Event('appready'));

        this._appService.title.subscribe((title) => {
            this.title = title;
            this._titleService.setTitle(title);
        });
    }
    
    isLoggedIn(): boolean {
        return this._loginService.isLoggedIn();
    }

    logoff() {
        if (confirm("Do you really want to log off?") == true) {
            this._loginService.logout();
        }
    }

}
