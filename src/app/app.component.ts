import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { AppService } from './app.service';
import { LocaleService } from './locale.service';
import { LoginService } from './data/login';
import { HomeService, HomeModule } from './data/home';
import { User } from './data/users';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    public static readonly LOCALE: string = LocaleService.LOCALE;

    public readonly appName: string = AppService.APP_NAME;

    title = '';

    opened = false;

    mainMenuEntries: HomeModule[];

    userSub: Subscription;

    lastTouchEnd = 0;

    constructor(
        private _translate: TranslateService,
        private _appService: AppService,
        private _localeService: LocaleService,
        private _titleService: Title,
        private _loginService: LoginService,
        private homeService: HomeService,
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

        // disable viewport zooming iOS 10+ safari
        if (this._appService.iOS()) {
            document.addEventListener('touchmove', this.preventIosSlideZoom, false);
            document.addEventListener('touchend', this.preventIosDoubleTapZoom, false);
        }
    }

    ngOnInit() {
        this.mainMenuEntries = this.homeService.loadModules();

        this.userSub = this._loginService.currentUser().subscribe(() => {
            this.mainMenuEntries = this.homeService.loadModules();
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    private preventIosSlideZoom(event: any) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }

    private preventIosDoubleTapZoom(event: any) {
        const now = (new Date()).getTime();
        if (now - this.lastTouchEnd <= 300) {
            event.preventDefault();
        }
        this.lastTouchEnd = now;
    }

    private toggleSidebar() {
        this.opened = !this.opened;
    }

    hasPrompt(): boolean {
        return this._appService.isUpdatable()
            || this._appService.isInstallable()
            || (this._appService.iOS() && !this._appService.isStandalone());
    }

    promptTitle(): string {
        let msg: string;
        if (this._appService.isUpdatable()) {
            msg = this._translate.instant('app.message.update');
        } else if (this._appService.isInstallable() || (this._appService.iOS() && !this._appService.isStandalone())) {
            msg = this._translate.instant('app.message.install');
        } else {
            msg = this.appName;
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

    private logout() {
        const msg: string = this._translate.instant('app.message.logout');
        if (confirm(msg) === true) {
            this._loginService.logout();
        }
    }

    private login() {
        this._router.navigate(['/login']);
    }

    logInOrOut() {
        if (this.isLoggedIn()) {
            this.logout();
        } else {
            this.login();
        }
    }

}
