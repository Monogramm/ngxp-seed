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
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private backendService: BackendService
    ) { }

    canActivateChild(_childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.isAuthorized();
    }
    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.isAuthorized();
    }

    canLoad(_route: Route): boolean {
        return this.isAuthorized();
    }

    private isAuthorized(): boolean {
        var isAuthenticated: boolean = this.backendService.isLoggedIn();
        if (!isAuthenticated) {
            this.router.navigate(['/login']);
        }
        return isAuthenticated;
    }
}
