import { Logger, Pagination } from '../shared';

import { StorageService } from './storage.service';

/**
 * The Backend fetch behavior.
 * 
 * Defines if the service shall only rely on the backend or should also look in the storage.
 */
export enum BackendFetchMode {
    /**
     * Only use the Backend services to retrieve data.
     */
    RemoteOnly,
    /**
     * First attempt to use the storage, then call the backend if nothing found.
     */
    StorageThenRemote
}

export abstract class BackendService {
    protected static readonly apiUrl = 'http://192.168.1.24:8080/spring-rest-api-starter/api/';

    protected static readonly tokenKey = 'access_token';
    protected static readonly userIdKey = 'principal_user_id';

    fetchBehavior: BackendFetchMode = BackendFetchMode.RemoteOnly;

    constructor(private _storageService: StorageService) {
    }

    getFromStore(key: string): any {
        return this._storageService.getItem(key);
    }
    pushToStore(key: string, value: any): void {
        return this._storageService.setItem(key, value);
    }
    removeFromStore(key: string): void {
        return this._storageService.removeItem(key);
    }
    clearStore(): void {
        return this._storageService.clear();
    }

    abstract isLoggedIn(): boolean;

    abstract get token(): string;
    abstract set token(theToken: string);

    abstract get userId(): string;
    abstract set userId(theId: string);

    abstract get userRoles(): string[];
    abstract set userRoles(roles: string[]);

    hasRole(role: string) :boolean {
        return this.userRoles && this.userRoles.indexOf('ROLE_' + role) > -1;
    }


    abstract get clientId(): string;
    abstract get clientSecret(): string;


    abstract load(basePath: string, pagination?: Pagination);

    getById(basePath: string, id: string, headers?: { header: string, value: any }[]): Promise<any> {
        return this.getByIds(basePath, [id], headers);
    }
    abstract getByIds(basePath: string, ids: string[], headers?: { header: string, value: any }[]): Promise<any>;

    push(basePath: string, value: any, headers?: { header: string, value: any }[]): Promise<any> {
        return this.pushAll(basePath, [value], headers);
    }
    abstract pushAll(basePath: string, values: any[], headers?: { header: string, value: any }[]): Promise<any>;

    set(basePath: string, id: string, value: any, headers?: { header: string, value: any }[]): Promise<any> {
        return this.setAll(basePath, [id], value, headers);
    }
    abstract setAll(basePath: string, ids: string[], values: any, headers?: { header: string, value: any }[]): Promise<any>;

    remove(basePath: string, id: string, headers?: { header: string, value: any }[]): Promise<any> {
        return this.removeAll(basePath, [id], headers);
    }
    abstract removeAll(basePath: string, ids: string[], headers?: { header: string, value: any }[]): Promise<any>;
}
