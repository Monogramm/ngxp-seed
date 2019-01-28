import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { BackendService } from '../../core';
import { Logger } from '../../shared';

export class HomeModule {
    constructor(public text: string,
        public route: string[],
        public iconClass: string,
        public fontIcon: string) { }
}

@Injectable()
export class HomeService {
    availableModules: HomeModule[] = [];

    constructor(
        private _backendService: BackendService) {
    }

    loadModules() {
        if (Logger.isEnabled) {
            Logger.log('loading available modules...');
        }

        this.availableModules.length = 0;

        if (this._backendService.isLoggedIn()) {
            this.availableModules.push(
                new HomeModule('home.profile', ['/user', this._backendService.userId], 'icon-profile', String.fromCharCode(0xe923)),
                new HomeModule('home.password', ['/user', this._backendService.userId, 'password'], 'icon-key', String.fromCharCode(0xe98d))
            );

            if (this._backendService.hasRole('ADMIN') || this._backendService.hasRole('SUPPORT')) {
                this.availableModules.push(
                    new HomeModule('home.roles', ['/roles'], 'icon-user-tie', String.fromCharCode(0xe976)),
                    new HomeModule('home.types', ['/types'], 'icon-filter', String.fromCharCode(0xea5b)),
                    new HomeModule('home.users', ['/users'], 'icon-users', String.fromCharCode(0xe972)),
                    new HomeModule('home.parameters', ['/parameters'], 'icon-wrench', String.fromCharCode(0xe991)),
                    new HomeModule('home.media', ['/mediums'], 'icon-images', String.fromCharCode(0xe90e)),
                );
            }
        }

        this.availableModules.push(
            new HomeModule('home.info', ['/info'], 'icon-info', String.fromCharCode(0xea0c)),
        );

        return this.availableModules;
    }
}
