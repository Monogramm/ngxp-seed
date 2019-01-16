import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AppService } from './app.service';
import { LoginService } from './data/login';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public static readonly LOCALE: string = 'en';

    public readonly appName: string = AppService.APP_NAME;

    title: string = '';

    lang: string = AppComponent.LOCALE;

    i18nHomeParam = { value: this.appName };

    constructor(
        private _translate: TranslateService,
        private _appService: AppService,
        private _titleService: Title,
        private _loginService: LoginService,
        private _router: Router) {
        // fallback language when a translation isn't found in the current language
        this._translate.setDefaultLang(AppComponent.LOCALE);

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this._translate.use(this.lang);

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
