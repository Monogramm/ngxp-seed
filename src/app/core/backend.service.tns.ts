import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseOptions } from '@angular/http';

import { Logger } from '../shared/logger';
import { Pagination } from '../shared/models';
import { BackendFetchMode, AbstractBackendService } from './abstract.backend.service';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';

@Injectable()
export class BackendService extends AbstractBackendService {
    public readonly config = {
        apiURL: environment.backendUrl,
        clientId: environment.clientId,
        clientSecret: environment.clientSecret
    };

    constructor(_storageService: StorageService,
        _authService: AuthService,
        private _http: Http) {
        super(_storageService, _authService);
    }


    get clientId(): string {
        return this.config.clientId;
    }
    get clientSecret(): string {
        return this.config.clientSecret;
    }


    load(basePath: string, pagination?: Pagination, headers?: { header: string, value: any }[]) {
        var relativePath: string = basePath;

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
            httpHeaders.append('X-Custom-Sort', JSON.stringify({ ModifiedAt: -1 }));

            let url = this.config.apiURL + relativePath;

            if (pagination) {
                let startAt: number, endAt: number;
                startAt = (pagination.page - 1) * pagination.size;
                endAt = pagination.page * pagination.size - 1;

                httpHeaders.append('X-Custom-Start-At', JSON.stringify({ startAt }));
                httpHeaders.append('X-Custom-End-At', JSON.stringify({ endAt }));
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

        response.catch(this.logError);

        return response;
    }

    push(basePath: string, value: any, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.post(
            url, value, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    pushAll(basePath: string, values: any[], headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.post(
            url, values, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    set(basePath: string, id: string, value: any, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath + '/' + id;

        var response: Promise<Response> = this._http.put(
            url, value, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    setAll(basePath: string, ids: string[], values: any, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.put(
            url, values, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    remove(basePath: string, id: string, headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        let url = this.config.apiURL + basePath + '/' + id;

        var response: Promise<Response> = this._http.delete(
            url, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    removeAll(basePath: string, ids: string[], headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders: Headers = this.getHeaders(headers);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.delete(
            url, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

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
