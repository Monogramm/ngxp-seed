import { Observable } from 'rxjs';

import { Pagination } from '../shared/models';
import { User } from '../data/users/user.model';

import { CachedValue, StorageService } from './storage.service';
import { AuthService } from './auth.service';

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

export abstract class AbstractBackendService {
    fetchBehavior: BackendFetchMode = BackendFetchMode.RemoteOnly;

    constructor(private storageService: StorageService,
        private authService: AuthService) {
        // Clear the backend's store if not valid anymore
        if (!this.isLoggedIn()) {
            this.clear();
        }
    }

    // Storage mechanisms
    protected getFromStore(key: string): any {
        return this.storageService.getItem(key);
    }
    public getFromCachedStore(key: string): any {
        var value: any = this.getFromStore(key);

        if (value) {
            var json: any = JSON.parse(value);

            if (json.date && new Date(json.date).getTime() > new Date().getTime()) {
                value = json;
            } else {
                this.removeFromStore(key);
                value = null;
            }
        }

        return value;
    }

    public pushToStore(key: string, value: any): void {
        if (typeof value === 'string') {
            return this.storageService.setItem(key, value);
        } else {
            return this.storageService.setItem(key, JSON.stringify(value));
        }
    }
    pushToCachedStore(key: string, value: any, date?: Date): void {
        return this.pushToStore(key, new CachedValue(value, date));
    }

    protected removeFromStore(key: string): void {
        return this.storageService.removeItem(key);
    }
    protected clearStore(): void {
        return this.storageService.clear();
    }



    // Authentication mechanisms
    public get user(): User {
        return this.authService.user;
    }
    public get currentUser(): Observable<User> {
        return this.authService.currentUser;
    }
    public authentifyUser(data: any): User {
        return this.authService.authentifyUser(data);
    }
    clear() {
        this.authService.clear();

        this.clearStore();
    }

    public isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
    protected get token(): string {
        return this.authService.token;
    }
    protected get tokenExpiration(): number {
        return this.authService.tokenExpiration;
    }
    protected get refreshToken(): string {
        return this.authService.refreshToken;
    }
    public get userId(): string {
        return this.authService.userId;
    }
    public hasRole(role: string): boolean {
        return this.authService.hasRole(role);
    }


    abstract get clientId(): string;
    abstract get clientSecret(): string;



    // Backend CRUD operations
    abstract load(basePath: string | URL, pagination?: Pagination);

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