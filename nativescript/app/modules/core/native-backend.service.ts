import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseOptions } from '@angular/http';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { Logger, DateUtils, Pagination } from '../../x-shared/app/shared';
import { BackendFetchMode, BackendService, CachedValue, StorageService } from '../../x-shared/app/core';

@Injectable()
export class NativeBackendService extends BackendService {
    public readonly config = {
        apiURL: BackendService.apiUrl,
        clientId: 'clientMobileIdPassword',
        clientSecret: 'secret'
    };

    constructor(private _storage: StorageService, private _http: Http) {
        super(_storage);
    }


    getFromCachedStore(key: string): any {
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
    pushToStore(key: string, value: any): void {
        if (typeof value === 'string') {
            return super.pushToStore(key, value);
        } else {
            return super.pushToStore(key, JSON.stringify(value));
        }
    }
    pushToCachedStore(key: string, value: any, date?: Date): void {
        return this.pushToStore(key, new CachedValue(value, date));
    }


    isLoggedIn(): boolean {
        return !!super.getFromStore(BackendService.tokenKey);
    }

    get token(): string {
        return <string>super.getFromStore(BackendService.tokenKey);
    }

    set token(theToken: string) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent token = ' + theToken);
        }

        super.pushToStore(BackendService.tokenKey, theToken);
    }

    get tokenExpiration(): Date {
        return <Date>super.getFromStore(BackendService.tokenExpirationKey);
    }

    set tokenExpiration(theTokenExpiration: Date) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent token expiration = ' + theTokenExpiration);
        }

        super.pushToStore(BackendService.tokenExpirationKey, theTokenExpiration);
    }

    get refreshToken(): string {
        return <string>super.getFromStore(BackendService.refreshTokenKey);
    }

    set refreshToken(theRefreshToken: string) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent refresh token = ' + theRefreshToken);
        }

        super.pushToStore(BackendService.refreshTokenKey, theRefreshToken);
    }

    get userId(): string {
        return <string>super.getFromStore(BackendService.userIdKey);
    }

    set userId(theId: string) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent user id = ' + theId);
        }

        super.pushToStore(BackendService.userIdKey, theId);
    }

    get userRoles(): string[] {
        let roles: string = <string>super.getFromStore('user.roles');
        
        return JSON.parse(roles);
    }

    set userRoles(roles: string[]) {
        if (Logger.isEnabled) {
            Logger.log('setting new persistent user roles = ' + roles);
        }

        super.pushToStore('user.roles', JSON.stringify(roles));
    }


    get clientId(): string {
        return this.config.clientId;
    }
    get clientSecret(): string {
        return this.config.clientSecret;
    }
    get apiUrl(): string {
        return this.config.apiURL;
    }


    load(basePath: string | URL, pagination?: Pagination, headers?: { header: string, value: any }[]) {
        var response: Promise<Response> = null;
        var relativePath: string;
        if (basePath instanceof URL) {
            relativePath = basePath.toString();
        } else {
            relativePath = basePath;

            // Try the storage if allowed
            if (this.fetchBehavior === BackendFetchMode.StorageThenRemote) {
                var storeValue: any = this.getFromCachedStore(relativePath);

                if (!(storeValue == null)) {
                    response = Promise.resolve(storeValue.value);
                }
            }
        }

        // Try the backend
        if (response === null) {
            let httpHeaders: Headers = this.getHeaders(headers);
            httpHeaders.append('X-Custom-Sort', JSON.stringify({ ModifiedAt: -1 }));

            let url: string;
            if (basePath instanceof URL) {
                url = relativePath;
            } else {
                url = this.config.apiURL + relativePath;
            }

            if (pagination) {
                let startAt, endAt;
                startAt = (pagination.page - 1) * pagination.size;
                endAt = pagination.page * pagination.size - 1;

                httpHeaders.append('X-Monogramm-Start-At', JSON.stringify({ startAt }));
                httpHeaders.append('X-Monogramm-End-At', JSON.stringify({ endAt }));
            }

            response = this._http.get(url, { headers: httpHeaders }).toPromise();

            if (this.fetchBehavior != BackendFetchMode.RemoteOnly) {
                response.then((value: Response) => {
                    this.pushToCachedStore(relativePath, JSON.stringify(value.json()));
                });
            }
        }

        response.catch(this.logError);

        return response;
    }

    getById(basePath: string, id: string, headers?: { header: string, value: any }[]): Promise<any> {
        var relativePath: string = basePath + '/' + id;

        // Try the storage if allowed
        var response: Promise<Response> = null;
        if (this.fetchBehavior === BackendFetchMode.StorageThenRemote) {
            var storeValue: any = this.getFromCachedStore(relativePath);

            if (!(storeValue == null)) {
                response = Promise.resolve(storeValue.value);
            }
        }

        // Try the backend
        if (response === null) {
            let httpHeaders: Headers = this.getHeaders(headers);

            let url = this.config.apiURL + relativePath;

            response = this._http.get(url, { headers: httpHeaders }).toPromise();

            if (this.fetchBehavior != BackendFetchMode.RemoteOnly) {
                response.then((value: Response) => {
                    this.pushToCachedStore(relativePath, JSON.stringify(value.json()));
                });
            }
        }

        response.catch(this.logError);

        return response;
    }

    getByIds(basePath: string, ids: string[], headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.get(
            url, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    push(basePath: string, value: any, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.post(
            url, value, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    pushAll(basePath: string, values: any[], headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.post(
            url, values, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    set(basePath: string, id: string, value: any, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath + '/' + id;

        var response: Promise<Response> = this._http.put(
            url, value, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    setAll(basePath: string, ids: string[], values: any, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.put(
            url, values, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    remove(basePath: string, id: string, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath + '/' + id;

        var response: Promise<Response> = this._http.delete(
            url, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    removeAll(basePath: string, ids: string[], headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.delete(
            url, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    private getHeaders(headers?: { header: string, value: any }[]): Headers {
        let httpHeaders: Headers = new Headers();

        httpHeaders.append('Content-Type', 'application/json');
        if (this.isLoggedIn()) {
            httpHeaders.append('Authorization', 'Bearer ' + this.token);
        }

        if (headers) {
            for (var entry of headers) {
                httpHeaders.append(entry.header, entry.value);
            }
        }

        return httpHeaders;
    }

    private appendHeaderIds(httpHeaders: Headers, ids: string[]): Headers {
        httpHeaders.append('X-Custom-Filter',
            JSON.stringify({
                'Id': {
                    '$in': ids
                }
            })
        );

        return httpHeaders;
    }

    private logError(error: Response): Promise<any> {
        if (typeof error.json === 'function') {
            Logger.dir(error.json());
        } else {
            Logger.dir(error);
        }
        return Promise.reject(error);
    }

}
