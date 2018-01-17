import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';

import { Logger } from '../../x-shared/app/shared';
import { BackendService } from '../../x-shared/app/core';

/**
 * Service to prevent load of ressource without the admin role.
 */
@Injectable()
export class AdminGuard implements CanLoad {
    constructor(private _backendService: BackendService, private router: Router) { }

    canLoad() {
        if (Logger.isEnabled) {
            Logger.log('checking role...');
        }

        if (this._backendService.hasRole('ADMIN')) {
            return true;
        }
        else {
            if (Logger.isEnabled) {
                Logger.log('user not admin');
            }

            return false;
        }
    }
}
