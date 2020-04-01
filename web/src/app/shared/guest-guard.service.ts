import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    CanLoad,
    Router,
    Route,
    RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '@xapp/core';

/**
 * Service to prevent access to ressource without being a guest.
 *
 * If the user is authenticated and tries to access a "guest only" resource (like '/login'),
 * redirection will be made to '/'.
 */
@Injectable()
export class GuestGuard implements CanLoad, CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivateChild(_childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.isGuest();
    }
    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.isGuest();
    }

    canLoad(_route: Route): boolean {
        return this.isGuest();
    }

    private isGuest(): boolean {
        const isGuest: boolean = !this.authService.isLoggedIn();
        if (!isGuest) {
            this.router.navigate(['/']);
        }
        return isGuest;
    }
}
