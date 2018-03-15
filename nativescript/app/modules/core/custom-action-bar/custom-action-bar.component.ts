import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Page } from 'ui/page';

import { AppResources } from '../../../x-shared/app/shared/app-resources';
import { LoginService } from '../../../x-shared/app/login';

@Component({
    selector: 'mg-custom-action-bar',
    moduleId: module.id,
    templateUrl: './custom-action-bar.component.html',
    styleUrls: ['./custom-action-bar-commons.component.css', './custom-action-bar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomActionBarComponent {
    @Input() title = AppResources.appName;

    constructor(private _router: Router,
        private _loginService: LoginService,
        private _page: Page) {
    }

    goHome() {
        this._router.navigate(['/']);
    }

    logoff(): void {
        this._loginService.logoff();
        this._router.navigate(['/login']);
    }
}
