import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpParamsOptions } from '@angular/common/http/src/params';

import { Observable } from 'rxjs';

import { Logger, Pagination } from '@xapp/shared';
import { BackendFetchMode, BackendService, SimpleHeader, AuthService, StorageService } from '@xapp/core';

import { environment } from '../../environments/environment';

@Injectable()
export class WebBackendService extends BackendService {
    public readonly config = {
        apiURL: environment.backendUrl,
        clientId: environment.clientId,
        clientSecret: environment.clientSecret
    };

    constructor(_storageService: StorageService,
        _authService: AuthService,
        private _http: HttpClient) {
        super(_storageService, _authService);
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

    load<T>(basePath: string | URL,
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Promise<HttpResponse<T[]>> {
        let response: Promise<HttpResponse<T[]>> = null;
        let relativePath: string;
        if (basePath instanceof URL) {
            relativePath = basePath.toString();
        } else {
            relativePath = basePath;

            // Try the storage if allowed
            if (this.fetchBehavior === BackendFetchMode.StorageThenRemote) {
                const storeValue: any = this.getFromCachedStore(relativePath);

                if (!(storeValue == null)) {
                    response = Promise.resolve(storeValue.value);
                }
            }
        }

        // Try the backend
        if (response === null) {
            let url: string;
            if (basePath instanceof URL) {
                url = relativePath;
            } else {
                url = this.config.apiURL + relativePath;
            }

            const httpHeaders: HttpHeaders = this.getHeaders(headers);
            const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

            response = this._http.get<T[]>(url, { observe: 'response', headers: httpHeaders, params: httpParams }).toPromise();

            response.then((value: HttpResponse<T[]>) => {
                if (pagination) {
                    this.updatePagination(pagination, value);
                    if (Logger.isEnabled) {
                        Logger.dir(pagination);
                    }
                }

                return Promise.resolve(value);
            });

            if (this.fetchBehavior !== BackendFetchMode.RemoteOnly) {
                response.then(
                    (value: HttpResponse<T[]>) => {
                        this.pushToCachedStore(relativePath, value.body);
                    },
                    (error: any) => {
                        this.logError(error);
                    }
                );
            }
        }

        return response;
    }

    getBlobById(basePath: string, id: string,
        headers?: SimpleHeader,
        params?: HttpParamsOptions): Observable<HttpResponse<Blob>> {
        const relativePath: string = basePath + '/' + id;

        // Try the storage if allowed
        let response: Observable<HttpResponse<Blob>> = null;

        // Try the backend
        if (response === null) {
            const httpHeaders: HttpHeaders = this.getHeaders(headers);
            const httpParams: HttpParams = this.getParameters(null, params, httpHeaders);

            const url = this.config.apiURL + relativePath;

            response = this._http.get(url, {
                observe: 'response',
                responseType: 'blob',
                headers: httpHeaders, params: httpParams
            });
        }

        return response;
    }

    getById<T>(basePath: string, id: string,
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Observable<HttpResponse<T>> {
        const relativePath: string = basePath + '/' + id;

        // Try the storage if allowed
        let response: Observable<HttpResponse<T>> = null;

        // Try the backend
        if (response === null) {
            const httpHeaders: HttpHeaders = this.getHeaders(headers);
            const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

            const url = this.config.apiURL + relativePath;

            response = this._http.get<T>(url, {
                observe: 'response',
                headers: httpHeaders, params: httpParams
            });
        }

        return response;
    }

    getByIds<T>(basePath: string, ids: string[],
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Observable<HttpResponse<T[]>> {
        let httpHeaders: HttpHeaders = this.getHeaders(headers);
        const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        const url = this.config.apiURL + basePath;

        const response: Observable<HttpResponse<T[]>> = this._http.get<T[]>(
            url, { observe: 'response', headers: httpHeaders, params: httpParams }
        );

        return response;
    }

    push<T>(basePath: string, value: any,
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Promise<HttpResponse<T>> {
        const httpHeaders = this.getHeaders(headers);
        const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

        const url = this.config.apiURL + basePath;

        const promise: Promise<HttpResponse<T>> = this._http.post<T>(
            url, value, { observe: 'response', headers: httpHeaders, params: httpParams }
        ).toPromise();

        promise.then((response: HttpResponse<T>) => {
            if (pagination) {
                this.updatePagination(pagination, response);
                if (Logger.isEnabled) {
                    Logger.dir(pagination);
                }
            }

            return Promise.resolve(response);
        });
        promise.catch(this.logError);

        return promise;
    }

    pushAll<T>(basePath: string, values: any,
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Promise<HttpResponse<T[]>> {
        const httpHeaders = this.getHeaders(headers);
        const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

        const url = this.config.apiURL + basePath;

        const promise: Promise<HttpResponse<T[]>> = this._http.post<T[]>(
            url, values, { observe: 'response', headers: httpHeaders, params: httpParams }
        ).toPromise();

        promise.then((response: HttpResponse<T[]>) => {
            if (pagination) {
                this.updatePagination(pagination, response);
                if (Logger.isEnabled) {
                    Logger.dir(pagination);
                }
            }

            return Promise.resolve(response);
        });
        promise.catch(this.logError);

        return promise;
    }

    set<T>(basePath: string, id: string, value: any,
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Promise<HttpResponse<T>> {
        const httpHeaders: HttpHeaders = this.getHeaders(headers);
        const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

        const url = this.config.apiURL + basePath + '/' + id;

        const promise: Promise<HttpResponse<T>> = this._http.put<T>(
            url, value, { observe: 'response', headers: httpHeaders, params: httpParams }
        ).toPromise();

        promise.then((response: HttpResponse<T>) => {
            if (pagination) {
                this.updatePagination(pagination, response);
                if (Logger.isEnabled) {
                    Logger.dir(pagination);
                }
            }

            return Promise.resolve(response);
        });
        promise.catch(this.logError);

        return promise;
    }

    setAll<T>(basePath: string, ids: string[], values: any,
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Promise<HttpResponse<T[]>> {
        let httpHeaders: HttpHeaders = this.getHeaders(headers);
        const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        const url = this.config.apiURL + basePath;

        const promise: Promise<HttpResponse<T[]>> = this._http.put<T[]>(
            url, values, { observe: 'response', headers: httpHeaders, params: httpParams }
        ).toPromise();

        promise.then((response: HttpResponse<T[]>) => {
            if (pagination) {
                this.updatePagination(pagination, response);
                if (Logger.isEnabled) {
                    Logger.dir(pagination);
                }
            }

            return Promise.resolve(response);
        });
        promise.catch(this.logError);

        return promise;
    }

    remove(basePath: string, id: string,
        pagination?: Pagination, params?: HttpParamsOptions,
        headers?: SimpleHeader): Promise<HttpResponse<Object>> {
        const httpHeaders = this.getHeaders(headers);
        const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

        let url = this.config.apiURL + basePath;
        if (id) {
            url += '/' + id;
        }

        const promise: Promise<HttpResponse<Object>> = this._http.delete(
            url, { observe: 'response', headers: httpHeaders, params: httpParams }
        ).toPromise();

        promise.then((response: HttpResponse<any>) => {
            if (pagination) {
                this.updatePagination(pagination, response);
                if (Logger.isEnabled) {
                    Logger.dir(pagination);
                }
            }

            return Promise.resolve(response);
        });
        promise.catch(this.logError);

        return promise;
    }

    removeAll(basePath: string, ids: string[],
        pagination?: Pagination, params?: HttpParamsOptions, headers?: SimpleHeader): Promise<HttpResponse<Object>> {
        const httpHeaders = this.getHeaders(headers);
        const httpParams: HttpParams = this.getParameters(pagination, params, httpHeaders);

        let url = this.config.apiURL + basePath;
        if (ids) {
            url += '?ids=';
            for (const entityId of ids) {
                url += entityId + ',';
            }
        }

        const promise: Promise<HttpResponse<Object>> = this._http.delete(
            url, { observe: 'response', headers: httpHeaders, params: httpParams }
        ).toPromise();

        promise.then((response: HttpResponse<any>) => {
            if (pagination) {
                this.updatePagination(pagination, response);
                if (Logger.isEnabled) {
                    Logger.dir(pagination);
                }
            }

            return Promise.resolve(response);
        });
        promise.catch(this.logError);

        return promise;
    }

    private getParameters(pagination: Pagination, params?: HttpParamsOptions, httpHeaders?: HttpHeaders): HttpParams {
        let httpParams: HttpParams;
        if (params) {
            httpParams = new HttpParams(params);
        } else {
            httpParams = new HttpParams();
        }

        if (pagination) {
            if (pagination.page) {
                let page: number, size: number;
                page = pagination.page - 1;

                httpParams = httpParams.set('page', '' + page);
                if (httpHeaders) {
                    httpHeaders.append('X-Custom-Page', JSON.stringify({ page }));
                }

                if (pagination.size) {
                    size = pagination.size;
                    httpParams = httpParams.set('size', '' + size);
                    if (httpHeaders) {
                        httpHeaders.append('X-Custom-Size', JSON.stringify({ size }));
                    }
                }

            }

            if (pagination.sort) {
                // Add sorting mechanisms
                let sortQuery = '';

                for (const entry of pagination.sort.entries) {
                    sortQuery += entry.field + ',' + entry.order + ';';
                }
                httpParams = httpParams.set('sort', sortQuery);
                if (httpHeaders) {
                    httpHeaders.append('X-Custom-Sort', JSON.stringify({ sortQuery }));
                }
            }
        }

        return httpParams;
    }

    private updatePagination(pagination: Pagination, value: HttpResponse<any>) {
        pagination.reset();

        const links: string = value.headers.get('link');
        if (links) {
            const firstPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="first"');
            if (firstPageProp && firstPageProp.length >= 2) {
                pagination.first = +firstPageProp[1] + 1;

                if (firstPageProp.length >= 3) {
                    pagination.size = +firstPageProp[2];
                }
            }

            const prevPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="prev"');
            if (prevPageProp && prevPageProp.length >= 2) {
                pagination.prev = +prevPageProp[1] + 1;

                if (prevPageProp.length >= 3) {
                    pagination.size = +prevPageProp[2];
                }
            }

            const nextPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="next"');
            if (nextPageProp && nextPageProp.length >= 2) {
                pagination.next = +nextPageProp[1] + 1;

                if (nextPageProp.length >= 3) {
                    pagination.size = +nextPageProp[2];
                }
            }

            const lastPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="last"');
            if (lastPageProp && lastPageProp.length >= 2) {
                pagination.last = +lastPageProp[1];

                if (lastPageProp.length >= 3) {
                    pagination.size = +lastPageProp[2];
                }
            }
        }
    }

    private getHeaders(headers?: SimpleHeader): HttpHeaders {
        let httpHeaders: HttpHeaders = new HttpHeaders(headers);

        if (!!!httpHeaders.has('Content-Type')) {
            httpHeaders = httpHeaders.append('Content-Type', 'application/json');
        } else if (httpHeaders.get('Content-Type') === '') {
            httpHeaders = httpHeaders.delete('Content-Type');
        }

        if (this.isLoggedIn() && !httpHeaders.has('Authorization')) {
            httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + this.token);
        }

        return httpHeaders;
    }

    private appendHeaderIds(httpHeaders: HttpHeaders, ids: string[]): HttpHeaders {
        httpHeaders = httpHeaders.append('X-Custom-Filter',
            JSON.stringify({
                'Id': {
                    '$in': ids
                }
            })
        );

        return httpHeaders;
    }

    private logError(error: any): Promise<any> {
        if (typeof error.json === 'function') {
            Logger.dir(error.json());
        } else {
            Logger.dir(error);
        }

        let msg: string;
        switch (error.status) {
            case 400:
                msg = 'app.message.error.bad_request';
                break;
            case 401:
                msg = 'app.message.error.unauthorized';
                break;
            case 403:
                msg = 'app.message.error.forbidden';
                break;
            case 404:
                msg = 'app.message.error.not_found';
                break;
            case 409:
                msg = 'app.message.error.invalid_request';
                break;
            case 500:
                msg = 'app.message.error.internal_error';
                break;
            case 503:
                msg = 'app.message.error.unavailable';
                break;
            case 504:
                msg = 'app.message.error.timeout';
                break;
        }

        // Hide the technical error from the end user as much as possible
        if (msg) {
            Logger.log(msg);
            return Promise.reject(msg);
        } else {
            return Promise.reject(error);
        }
    }

}
