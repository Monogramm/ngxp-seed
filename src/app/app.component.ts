import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

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

    title = '';

    constructor(
        private _translate: TranslateService,
        private _appService: AppService,
        private _localeService: LocaleService,
        private _titleService: Title,
        private _loginService: LoginService,
        private _router: Router) {
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

    hasPrompt(): boolean {
        return this._appService.isInstallable() || (this._appService.iOS() && !this._appService.isStandalone());
    }

    promptTitle(): string {
        let msg: string;
        if (this._appService.isUpdatable()) {
            msg = this._translate.instant('app.message.update');
        } else if (this._appService.isInstallable() || (this._appService.iOS() && !this._appService.isStandalone())) {
            msg = this._translate.instant('app.message.install');
        } else {
            msg = this._translate.instant('app.top_bar.home.title');
        }
        return msg;
    }

    appPrompt(): void {
        if (this._appService.isUpdatable()) {
            const msg: string = this._translate.instant('app.message.update');
            if (confirm(msg) === true) {
                // Reload page to update PWA
                this._appService.reload();
            }
        } else if (this._appService.isInstallable()) {
            // Trigger PWA prompt
            this._appService.addToHomeScreen();
        } else if (this._appService.iOS() && !this._appService.isStandalone()) {
            const msg: string = this._translate.instant('app.message.install');
            if (confirm(msg) === true) {
                // Navigate to /info/install
                this._router.navigate(['/info', 'install']);
            }
        } else {
            this._router.navigate(['/']);
        }
    }

    isLoggedIn(): boolean {
        return this._loginService.isLoggedIn();
    }

    logout() {
        const msg: string = this._translate.instant('app.message.logout');
        if (confirm(msg) === true) {
            this._loginService.logout();
        }
    }

}
