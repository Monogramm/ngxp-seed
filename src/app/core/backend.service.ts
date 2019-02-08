import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Logger } from '../shared/logger';
import { Pagination } from '../shared/models';
import { BackendFetchMode, AbstractBackendService, SimpleHeader } from './abstract.backend.service';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

import { environment } from '../../environments/environment';
import { HttpParamsOptions } from '@angular/common/http/src/params';

@Injectable()
export class BackendService extends AbstractBackendService {
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


    load<T>(basePath: string | URL,
        pagination?: Pagination,
        headers?: SimpleHeader, params?: HttpParamsOptions): Promise<HttpResponse<T[]>> {
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
            const httpHeaders: HttpHeaders = this.getHeaders(headers);

            let url: string;
            if (basePath instanceof URL) {
                url = relativePath;
            } else {
                url = this.config.apiURL + relativePath;
            }

            let httpParams: HttpParams = new HttpParams(params);
            if (pagination && pagination.page) {
                let page: number, size: number;
                page = pagination.page - 1;

                httpHeaders.append('X-Custom-Page', JSON.stringify({ page }));
                httpParams = httpParams.set('page', '' + page);

                if (pagination.size) {
                    size = pagination.size;
                    httpHeaders.append('X-Custom-Size', JSON.stringify({ size }));
                    httpParams = httpParams.set('size', '' + size);
                }

            }

            if (pagination && pagination.sort) {
                // Add sorting mechanisms
                let sortQuery = '';

                for (const entry of pagination.sort.entries) {
                    sortQuery += entry.field + ',' + entry.order + ';';
                }
                httpHeaders.append('X-Custom-Sort', JSON.stringify({ sortQuery }));
                httpParams = httpParams.set('sort', sortQuery);
            }

            response = this._http.get<T[]>(url, { observe: 'response', headers: httpHeaders, params: httpParams }).toPromise();

            response.then((value: HttpResponse<T[]>) => {
                if (pagination) {
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
            const httpParams: HttpParams = new HttpParams(params);

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
        headers?: SimpleHeader,
        params?: HttpParamsOptions): Observable<HttpResponse<T>> {
        const relativePath: string = basePath + '/' + id;

        // Try the storage if allowed
        let response: Observable<HttpResponse<T>> = null;

        // Try the backend
        if (response === null) {
            const httpHeaders: HttpHeaders = this.getHeaders(headers);
            const httpParams: HttpParams = new HttpParams(params);

            const url = this.config.apiURL + relativePath;

            response = this._http.get<T>(url, {
                observe: 'response',
                headers: httpHeaders, params: httpParams
            });
        }

        return response;
    }

    getByIds<T>(basePath: string, ids: string[], headers?: SimpleHeader): Observable<HttpResponse<T[]>> {
        let httpHeaders: HttpHeaders = this.getHeaders(headers);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        const url = this.config.apiURL + basePath;

        const response: Observable<HttpResponse<T[]>> = this._http.get<T[]>(
            url, { observe: 'response', headers: httpHeaders }
        );

        return response;
    }

    push<T>(basePath: string, value: any, headers?: SimpleHeader): Promise<HttpResponse<T>> {
        const httpHeaders = this.getHeaders(headers);

        const url = this.config.apiURL + basePath;

        const response: Promise<HttpResponse<T>> = this._http.post<T>(
            url, value, { observe: 'response', headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    pushAll<T>(basePath: string, values: any, headers?: SimpleHeader): Promise<HttpResponse<T[]>> {
        const httpHeaders = this.getHeaders(headers);

        const url = this.config.apiURL + basePath;

        const response: Promise<HttpResponse<T[]>> = this._http.post<T[]>(
            url, values, { observe: 'response', headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    set<T>(basePath: string, id: string, value: any, headers?: SimpleHeader): Promise<HttpResponse<T>> {
        const httpHeaders: HttpHeaders = this.getHeaders(headers);

        const url = this.config.apiURL + basePath + '/' + id;

        const response: Promise<HttpResponse<T>> = this._http.put<T>(
            url, value, { observe: 'response', headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    setAll<T>(basePath: string, ids: string[], values: any, headers?: SimpleHeader): Promise<HttpResponse<T[]>> {
        let httpHeaders: HttpHeaders = this.getHeaders(headers);

        httpHeaders = this.appendHeaderIds(httpHeaders, ids);

        const url = this.config.apiURL + basePath;

        const response: Promise<HttpResponse<T[]>> = this._http.put<T[]>(
            url, values, { observe: 'response', headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    remove(basePath: string, id: string, headers?: SimpleHeader): Promise<HttpResponse<Object>> {
        const httpHeaders = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;
        if (id) {
            url += '/' + id;
        }

        const response: Promise<HttpResponse<Object>> = this._http.delete(
            url, { observe: 'response', headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
    }

    removeAll(basePath: string, ids: string[], headers?: SimpleHeader): Promise<HttpResponse<Object>> {
        const httpHeaders = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;
        if (ids) {
            url += '?ids=';
            for (const entityId of ids) {
                url += entityId + ',';
            }
        }

        const response: Promise<HttpResponse<Object>> = this._http.delete(
            url, { observe: 'response', headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError);

        return response;
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

        switch (error.status) {
            case 400:
                Logger.log('An internal error occurred while sending your request.');
                break;
            case 401:
                Logger.log('You are not authorized to access this resource.');
                break;
            case 403:
                Logger.log('Access to this resource is forbidden.');
                break;
            case 404:
                Logger.log('This resource does not seem to exist anymore.');
                break;
            case 409:
                Logger.log('Your request is not valid. Check that you have filled in all the fields.');
                break;
            case 500:
                Logger.log('An internal error occurred while processing your request.');
                break;
        }

        return Promise.reject(error);
    }

}
