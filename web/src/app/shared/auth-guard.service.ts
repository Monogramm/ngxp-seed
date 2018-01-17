import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { Logger } from '../../x-shared/app/shared';
import { BackendService } from '../../x-shared/app/core';

/**
 * Service to prevent access to ressource without being connected.
 * 
 * If the user is anonymous and tries to access an authenticated resource,
 * redirection will be made to '/login'.
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private _backendService: BackendService, private _router: Router) { }

    canActivate() {
        if (Logger.isEnabled) {
            Logger.log('checking access...');
        }

        if (this._backendService.isLoggedIn()) {
            return true;
        }
        else {
            if (Logger.isEnabled) {
                Logger.log('user not authenticated => redirection to login');
            }

            this._router.navigate(['/login']);
            return false;
        }
    }
}
