import { ClassProvider } from '@angular/core';

import { Pagination } from '../../shared/models';

import { SimpleHeader, AbstractBackendService } from '../abstract.backend.service';
import { StorageService } from '../storage.service';
import { AuthService } from '../auth.service';

export class FakeBackendService extends AbstractBackendService {

    constructor(_storageService: StorageService,
        _authService: AuthService) {
        super(_storageService, _authService);
    }

    get clientId(): string { return 'dummy_clientId'; }
    get clientSecret(): string { return 'dummy_clientSecret'; }

    load(basePath: string, pagination?: Pagination) { return null; }

    getById(basePath: string, id: string, headers?: SimpleHeader) { return null; }
    getByIds(basePath: string, ids: string[], headers?: SimpleHeader) { return null; }

    push(basePath: string, value: any, headers?: SimpleHeader) { return null; }
    pushAll(basePath: string, values: any[], headers?: SimpleHeader) { return null; }

    set(basePath: string, id: string, value: any, headers?: SimpleHeader) { return null; }
    setAll(basePath: string, ids: string[], values: any, headers?: SimpleHeader) { return null; }

    remove(basePath: string, id: string, headers?: SimpleHeader) { return null; }
    removeAll(basePath: string, ids: string[], headers?: SimpleHeader) { return null; }
}

export let fakeBackendServiceProvider: ClassProvider = {
    provide: FakeBackendService,
    useClass: FakeBackendService
};
