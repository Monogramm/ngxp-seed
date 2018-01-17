import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { BackendService } from '../core';
import { Logger, Pagination } from '../shared';

export class HomeModule {
    constructor(public text: string,
        public route: string[],
        public iconClass: string,
        public fontIcon: string) { }
}

@Injectable()
export class HomeService {
    availableModules: HomeModule[] = [];

    constructor(private _backendService: BackendService) {
    }

    loadModules() {
        if (Logger.isEnabled) {
            Logger.log('loading available modules...');
        }

        this.availableModules.length = 0;

        if (this._backendService.hasRole('ADMIN') || this._backendService.hasRole('SUPPORT')) {
            this.availableModules.push(
                new HomeModule('Roles', ['/roles'], 'icon-user-tie', String.fromCharCode(0xe976)),
                new HomeModule('Types', ['/types'], 'icon-filter', String.fromCharCode(0xea5b)),
                new HomeModule('Users', ['/users'], 'icon-users', String.fromCharCode(0xe972))
            );
        }

        if (this._backendService.isLoggedIn()) {
            this.availableModules.push(
                new HomeModule('Profile', ['/user', this._backendService.userId], 'icon-profile', String.fromCharCode(0xe923))
            );
            this.availableModules.push(
                new HomeModule('Password', ['/user', this._backendService.userId, 'password'], 'icon-key', String.fromCharCode(0xe98d))
            );
        }

        return this.availableModules;
    }
}
