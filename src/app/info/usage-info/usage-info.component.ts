import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared';

@Component({
    selector: 'usage',
    templateUrl: './usage-info.component.html',
    styleUrls: ['./usage-info.component.scss']
})
export class UsageInfoComponent {

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    back() {
        this._location.back();
    }

}
