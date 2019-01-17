import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AppService } from './app.service';
import { LocaleService } from './locale.service';
import { LoginService } from './data/login';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public static readonly LOCALE: string = LocaleService.LOCALE;

    public readonly appName: string = AppService.APP_NAME;

    title: string = '';

    constructor(
        private _translate: TranslateService,
        private _appService: AppService,
        private _localeService: LocaleService,
        private _titleService: Title,
        private _loginService: LoginService) {
        // fallback language when a translation isn't found in the current language
        this._translate.setDefaultLang(AppComponent.LOCALE);

        // the current lang to use
        this._localeService.locale.subscribe((locale: string) => {
            this._translate.use(locale);
        });

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

    logout() {
        var msg: string = this._translate.instant('app.message.logout');
        if (confirm(msg) == true) {
            this._loginService.logout();
        }
    }

}
