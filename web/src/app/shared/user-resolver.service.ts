import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import {
    Router,
    Resolve,
} from '@angular/router';

import { BackendService } from '@xapp/core';

@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<void> {
    constructor(private backendService: BackendService, private router: Router) {
    }

    resolve(): Observable<any> {
        return this.backendService.currentUser.pipe(take(1));
    }
}
