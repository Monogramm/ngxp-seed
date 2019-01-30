import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseOptions, RequestOptionsArgs } from '@angular/http';

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

            let url: string;
            if (basePath instanceof URL) {
                url = relativePath;
            } else {
                url = this.config.apiURL + relativePath;
            }

            if (pagination && pagination.page) {
                let page: number, size: number;
                page = pagination.page - 1;

                httpHeaders.append('X-Custom-Page', JSON.stringify({ page }));
                url += '?page=' + page;

                if (pagination.size) {
                    size = pagination.size;
                    httpHeaders.append('X-Custom-Size', JSON.stringify({ size }));
                    url += '&size=' + size;
                }

            }

            if (pagination && pagination.sort) {
                // TODO Add sorting mechanisms
                //httpHeaders.append('X-Custom-Sort', JSON.stringify({ ModifiedAt: -1 }));

            }

            response = this._http.get(url, { headers: httpHeaders }).toPromise();

            response.then((value: Response) => {
                if (pagination) {
                    pagination.reset();

                    var links: string = value.headers.get('link');
                    if (links) {
                        var firstPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="first"');
                        if (firstPageProp && firstPageProp.length >= 2) {
                            pagination.first = +firstPageProp[1] + 1;
                        }

                        var prevPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="prev"');
                        if (prevPageProp && prevPageProp.length >= 2) {
                            pagination.prev = +prevPageProp[1] + 1;
                        }

                        var nextPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="next"');
                        if (nextPageProp && nextPageProp.length >= 2) {
                            pagination.next = +nextPageProp[1] + 1;
                        }

                        var lastPageProp: RegExpMatchArray = links.match('page=([0-9]+)&size=([0-9]+)>; rel="last"');

                        if (lastPageProp && lastPageProp.length >= 2) {
                            pagination.last = +lastPageProp[1];
                        }
                    }
                    if (Logger.isEnabled) {
                        Logger.dir(pagination);
                    }
                }

                return Promise.resolve(value);
            });

            if (this.fetchBehavior != BackendFetchMode.RemoteOnly) {
                response.then(
                    (value: Response) => {
                        this.pushToCachedStore(relativePath, value.json());
                    },
                    (error: any) => {
                        this.logError(error);
                    }
                );
            }
        }

        return response;
    }

    getById(basePath: string, id: string, headers?: { header: string, value: any }[], args?: RequestOptionsArgs): Promise<any> {
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

            var httpArgs: RequestOptionsArgs;
            if (args) {
                httpArgs = args;
            } else {
                httpArgs = {};
            }
            httpArgs.headers = httpHeaders;

            response = this._http.get(url, httpArgs).toPromise();

            if (this.fetchBehavior != BackendFetchMode.RemoteOnly) {
                response.then((value: Response) => {
                    this.pushToCachedStore(relativePath, value.json());
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
        let httpHeaders = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;

        var response: Promise<Response> = this._http.post(
            url, value, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    pushAll(basePath: string, values: any[], headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders = this.getHeaders(headers);

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
        let httpHeaders = this.getHeaders(headers);

        let url = this.config.apiURL + basePath;
        if (id) {
            url += '/' + id;
        }

        var response: Promise<Response> = this._http.delete(
            url, { headers: httpHeaders }
        ).toPromise();

        response.catch(this.logError)

        return response;
    }

    removeAll(basePath: string, ids: string[], headers?: { header: string, value: any }[]): Promise<any> {
        let httpHeaders = this.getHeaders(headers);

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
                if (entry.value) {
                    httpHeaders.set(entry.header, entry.value);
                } else {
                    httpHeaders.delete(entry.header);
                }
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

        switch (error.status) {
            case 400:
                Logger.log("An internal error occurred while sending your request.");
                break;
            case 401:
                Logger.log("You are not authorized to access this resource.");
                break;
            case 403:
                Logger.log("Access to this resource is forbidden.");
                break;
            case 404:
                Logger.log("This resource does not seem to exist anymore.");
                break;
            case 409:
                Logger.log("Your request is not valid. Check that you have filled in all the fields.");
                break;
            case 500:
                Logger.log("An internal error occurred while processing your request.");
                break;
        }

        return Promise.reject(error);
    }

}
