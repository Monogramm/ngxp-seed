import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';

import { Observable, BehaviorSubject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';
import { ios } from 'tns-core-modules/application/application';

@Injectable()
export class AppService {

    private static readonly iDevices: string[] = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ];

    public static readonly APP_NAME = environment.appName;

    private title$: BehaviorSubject<string> = new BehaviorSubject(AppService.APP_NAME);

    title: Observable<string> = this.title$.asObservable();

    pwaBeforeInstallPromptEvent: any = null;
    pwaInstalledEvent: any = null;

    pwaUpdateAvailableEvent: UpdateAvailableEvent = null;

    constructor(private swUpdate: SwUpdate,
        private translate: TranslateService) {
        window.addEventListener('beforeinstallprompt', (evt: Event) => {
            this.pwaBeforeInstallPromptEvent = evt;
            console.log('This app could be installed on your device');
        });

        window.addEventListener('appinstalled', (evt: Event) => {
            this.pwaInstalledEvent = evt;
            console.log('This app was installed on your device');
        });

        this.swUpdate.available.subscribe((evt: UpdateAvailableEvent) => {
            this.pwaUpdateAvailableEvent = evt;
            console.log('This app should be updated');
            // an update is available, ask user to confirm reload
            // go to ngsw-config.json to edit available update content
            this.confirmReload(evt.available);
        });
    }

    /**
     * Trigger PWA install prompt.
     */
    addToHomeScreen(): boolean {
        var promptDisplayed: boolean;

        if (this.pwaBeforeInstallPromptEvent === null) {
            console.log('No A2HS event to trigger for this device');
        } else {
            this.pwaBeforeInstallPromptEvent.prompt();

            // Wait for the user to respond to the prompt
            this.pwaBeforeInstallPromptEvent.userChoice
                .then((choiceResult: any) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                });
        }

        return promptDisplayed;
    }

    /**
     * Is app automatically installable through PWA install events.
     */
    isInstallable(): boolean {
        return this.pwaBeforeInstallPromptEvent !== null;
    }

    private _isIOS: boolean = null;
    iOS(): boolean {
        if (this._isIOS === null && !!navigator.platform) {
            for (var iDevice of AppService.iDevices) {
                if (navigator.platform === iDevice) {
                    this._isIOS = true;
                    break;
                }
            }
            // Fallback to userAgent if platform was not detected as Apple device
            if (!!!this._isIOS) {
                const userAgent = window.navigator.userAgent.toLowerCase();
                this._isIOS = /iphone|ipad|ipod/.test(userAgent);
            }
        }

        return this._isIOS;
    }

    private _isStandalone: boolean = null;
    isStandalone(): boolean {
        if (this._isStandalone === null) {
            this._isStandalone = ('standalone' in window.navigator) && (window.navigator.standalone);
        }
        return this._isStandalone;
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
