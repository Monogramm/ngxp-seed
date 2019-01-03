import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanLoad,
    Router,
    Route,
    RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../core/auth.service';

@Injectable()
export class RoleGuard implements CanLoad, CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
        return this.isAuthorized(_route);
    }

    canLoad(_route: Route): boolean {
        return this.isAuthorized(_route);
    }

    private isAuthorized(_route: Route | ActivatedRouteSnapshot): boolean {
        // List of roles needed to access given route
        const expectedRoles: Array<string> = _route.data.expectedRoles;

        // No roles needed
        if (!expectedRoles) {
            return true;
        }

        // If user has any of the expected roles, authorized
        for (const role in expectedRoles) {
            if (this.authService.hasRole(role)) {
                return true;
            }
        }

        this.router.navigate(['/']);
        return false;
    }
}
