import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class LocaleService {

    public static readonly LOCALE: string = environment.locale;

    private locale$: BehaviorSubject<string> = new BehaviorSubject(LocaleService.LOCALE);

    locale: Observable<string> = this.locale$.asObservable();

    constructor() { }

    setLocale(locale: string) {
        this.locale$.next(locale);
    }
}
