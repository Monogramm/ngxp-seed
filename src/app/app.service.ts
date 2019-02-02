import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';

import { Observable, BehaviorSubject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';

@Injectable()
export class AppService {

    public static readonly APP_NAME = environment.appName;

    private title$: BehaviorSubject<string> = new BehaviorSubject(AppService.APP_NAME);

    title: Observable<string> = this.title$.asObservable();

    pwaBeforeInstallPromptEvent: any = null;

    constructor(private swUpdate: SwUpdate,
        private translate: TranslateService) {
        window.addEventListener('beforeinstallprompt', event => {
            this.pwaBeforeInstallPromptEvent = event;
            console.log('This app could be installed on your device');
        });

        this.swUpdate.available.subscribe((evt: UpdateAvailableEvent) => {
            // an update is available, ask user to confirm reload
            // go to ngsw-config.json to edit available update content
            this.confirmReload(evt.available);
        });
    }

    promptPwaInstall() {
        this.pwaBeforeInstallPromptEvent.prompt();
    }

    confirmReload(available: { hash: string; appData?: Object; }) {
        this.translate.get('app.message.update', { value: available.appData }).subscribe((msg: string) => {
            if (confirm(msg) == true) {
                this.reload();
            }
        });
    }

    reload() {
        window.location.reload();
    }

    setTitle(title: string) {
        this.title$.next(title);
    }

    appendToTitle(appendix: string) {
        var title = AppService.APP_NAME + ' ' + appendix;
        this.setTitle(title);
    }
}
