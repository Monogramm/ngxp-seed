import { ClassProvider } from '@angular/core';

import { BackendService } from '../backend.service';
import { Pagination } from '../../shared/models';

export { BackendFetchMode, BackendService } from '../backend.service';
import { StorageService } from '../storage.service';

export class FakeBackendService extends BackendService {

    constructor(private _storage: StorageService) {
        super(_storage);
    }

    isLoggedIn(): boolean { return true; }

    get token(): string { return 'dummy_token'; }
    set token(theToken: string) { }

    get tokenExpiration(): Date { return new Date(Date.now() + (1000 * 3600 * 24)); }
    set tokenExpiration(theTokenExpiration: Date) { }

    get refreshToken(): string { return 'dummy_refresh_token'; }
    set refreshToken(theRefreshToken: string) { }

    get userId(): string { return 'dummy_user_id'; }
    set userId(theId: string) { }

    get userRoles(): string[] { return []; }
    set userRoles(roles: string[]) { }

    get clientId(): string { return 'dummy_clientId'; }
    get clientSecret(): string { return 'dummy_clientSecret'; }

    load(basePath: string, pagination?: Pagination) { return null; }

    getById(basePath: string, id: string, headers?: { header: string, value: any }[]) { return null; }
    getByIds(basePath: string, ids: string[], headers?: { header: string, value: any }[]) { return null; }

    push(basePath: string, value: any, headers?: { header: string, value: any }[]) { return null; }
    pushAll(basePath: string, values: any[], headers?: { header: string, value: any }[]) { return null; }

    set(basePath: string, id: string, value: any, headers?: { header: string, value: any }[]) { return null; }
    setAll(basePath: string, ids: string[], values: any, headers?: { header: string, value: any }[]) { return null; }

    remove(basePath: string, id: string, headers?: { header: string, value: any }[]) { return null; }
    removeAll(basePath: string, ids: string[], headers?: { header: string, value: any }[]) { return null; }
}

export let fakeBackendServiceProvider: ClassProvider = {
    provide: BackendService,
    useClass: FakeBackendService
};
