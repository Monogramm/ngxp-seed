import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Logger } from '../shared/logger';

import { StorageService } from './storage.service';

import { User } from '../users/user.model';

@Injectable()
export class AuthService {
    private static readonly tokenKey = 'access_token';
    private static readonly tokenExpirationKey = 'token_expiration';
    private static readonly refreshTokenKey = 'refresh_token';

    // TODO Use directly the JWT token to retrieve user/roles/permissions
    private static readonly userKey = 'principal_user';
    protected static readonly userIdKey = 'principal_user_id';
    private static readonly userRolesKey = 'principal_user_roles';

    protected static readonly keysToClear = [
        AuthService.tokenKey,
        AuthService.tokenExpirationKey,
        AuthService.refreshTokenKey,
        AuthService.userIdKey,
        AuthService.userRolesKey,
    ];

    private user$: BehaviorSubject<User>;

    constructor(private storage: StorageService) {
        this.user$ = new BehaviorSubject(null);
        // Clear the authentication information if not valid anymore
        if (!this.isLoggedIn()) {
            this.clear();
        }
    }

    // Storage mechanisms
    protected getFromStore(key: string): any {
        return this.storage.getItem(key);
    }
    public pushToStore(key: string, value: any): void {
        if (typeof value === 'string') {
            return this.storage.setItem(key, value);
        } else {
            return this.storage.setItem(key, JSON.stringify(value));
        }
    }


    // Authentication mechanisms
    public get user(): User {
        const userStr = this.getFromStore(AuthService.userKey);
        return userStr ? <User> JSON.parse(userStr) : null;
    }
    public get currentUser(): Observable<User> {
        return this.user$;
    }
    public authentifyUser(data: any): User {
        const user: User = this.parseLogin(data);
        this.user$.next(user);
        this.pushToStore(AuthService.userKey, user);
        return user;
    }
    private parseLogin(data: any): User | null {
        if (!data) {
            this.clear();
            return null;
        }

        const user: User = new User();

        user.id = data.principal_id;
        user.username = data.principal_name;
        user.email = data.principal_email;
        user.verified = data.verified;

        this.token = data.access_token;
        this.tokenExpiration = data.timestamp + (data.expires_in * 1000);

        this.refreshToken = data.refresh_token;

        this.userRoles = data.roles;

        return user;
    }
    public clear() {
        if (Logger.isEnabled) {
            Logger.log('Clear backend services resources.');
        }

        AuthService.keysToClear.forEach(key => {
            this.storage.removeItem(key);
        });

        this.user$.next(null);
    }

    public isLoggedIn(): boolean {
        const token: string = this.token;
        const tokenExpiration: number = this.tokenExpiration;
        const remainingTime = !!tokenExpiration ? tokenExpiration - Date.now() : -1;

        return !!token && remainingTime > 0;
    }

    public get token(): string {
        return <string>this.getFromStore(AuthService.tokenKey);
    }
    public set token(theToken: string) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent token = ' + theToken);
        }

        this.pushToStore(AuthService.tokenKey, theToken);
    }

    public get tokenExpiration(): number {
        return <number>this.getFromStore(AuthService.tokenExpirationKey);
    }
    public set tokenExpiration(theTokenExpiration: number) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent token expiration = ' + theTokenExpiration);
        }

        this.pushToStore(AuthService.tokenExpirationKey, theTokenExpiration);
    }

    public get refreshToken(): string {
        return <string>this.getFromStore(AuthService.refreshTokenKey);
    }
    public set refreshToken(theRefreshToken: string) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent refresh token = ' + theRefreshToken);
        }

        this.pushToStore(AuthService.refreshTokenKey, theRefreshToken);
    }

    public get userId(): string {
        const tmpUser = this.user;
        return tmpUser ? tmpUser.id : null;
    }

    public get userRoles(): string[] {
        const roles: string = <string>this.getFromStore(AuthService.userRolesKey);

        return !!roles ? JSON.parse(roles) : [];
    }
    public set userRoles(roles: string[]) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent user roles = ' + roles);
        }

        this.pushToStore(AuthService.userRolesKey, JSON.stringify(roles));
    }

    public hasRole(role: string): boolean {
        return this.userRoles && this.userRoles.indexOf('ROLE_' + role) > -1;
    }

}
