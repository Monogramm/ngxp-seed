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

import { User } from '@xapp/users';
import { AuthService } from '@xapp/core';

/**
 * Service to prevent access to ressource without being verified.
 *
 * If the user is not verified and tries to access an verified resource,
 * redirection will be made to '/'.
 */
@Injectable()
export class VerifyGuard implements CanLoad, CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivateChild(_childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.isVerified();
    }
    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.isVerified();
    }

    canLoad(_route: Route): boolean {
        return this.isVerified();
    }

    private isVerified(): boolean {
        // TODO Should use the Observable<User> instead ?
        const user: User = this.authService.user;
        const isVerified: boolean = user && user.verified;
        if (!isVerified) {
            if (user && user.id) {
                this.router.navigate(['register', user.id]);
            } else {
                this.router.navigate(['/']);
            }
        }
        return isVerified;
    }
}
