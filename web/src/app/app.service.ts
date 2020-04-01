import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';

import { Observable, BehaviorSubject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { AppResources } from '@xapp/shared';

import { environment } from '../environments/environment';

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

    public static readonly APP_NAME = environment.appName || AppResources.appName;

    private title$: BehaviorSubject<string> = new BehaviorSubject(AppService.APP_NAME);

    title: Observable<string> = this.title$.asObservable();

    pwaBeforeInstallPromptEvent: any = null;
    pwaInstalledEvent: any = null;

    pwaUpdateAvailableEvent: UpdateAvailableEvent = null;

    private _isIOS: boolean = null;
    private _isStandalone: boolean = null;

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
        });
    }

    /**
     * Trigger PWA install prompt.
     */
    addToHomeScreen(): boolean {
        let promptDisplayed: boolean;

        if (this.pwaBeforeInstallPromptEvent === null) {
            console.log('No A2HS event to trigger for this device');
            promptDisplayed = false;
        } else {
            this.pwaBeforeInstallPromptEvent.prompt();
            promptDisplayed = true;

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

    iOS(): boolean {
        if (this._isIOS === null && !!navigator.platform) {
            for (const iDevice of AppService.iDevices) {
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

    isStandalone(): boolean {
        if (this._isStandalone === null) {
            this._isStandalone = window.navigator && ('standalone' in window.navigator) && ((window.navigator as any).standalone);
        }
        return this._isStandalone;
    }

    /**
     * Is app automatically updatable through PWA update events.
     */
    isUpdatable(): boolean {
        return this.pwaUpdateAvailableEvent !== null;
    }

    confirmReload() {
        this.translate.get('app.message.update', { value: this.pwaUpdateAvailableEvent.available.appData })
            .subscribe((msg: string) => {
                if (confirm(msg) === true) {
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
        const title = AppService.APP_NAME + ' ' + appendix;
        this.setTitle(title);
    }
}
