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

import { BackendService } from '../core/backend.service';

@Injectable()
export class GuestGuard implements CanLoad, CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private backendService: BackendService
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
        var isGuest: boolean = !this.backendService.isLoggedIn();
        if (!isGuest) {
            this.router.navigate(['/']);
        }
        return isGuest;
    }
}
