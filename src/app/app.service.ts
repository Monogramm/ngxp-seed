import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class AppService {

    public static readonly APP_NAME = environment.appName;

    private title$: BehaviorSubject<string> = new BehaviorSubject(AppService.APP_NAME);

    title: Observable<string> = this.title$.asObservable();

    constructor() { }

    setTitle(title: string) {
        this.title$.next(title);
    }

    appendToTitle(appendix: string) {
        var title = AppService.APP_NAME + ' ' + appendix;
        this.setTitle(title);
    }
}
