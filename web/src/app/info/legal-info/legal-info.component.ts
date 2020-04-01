import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '@xapp/shared';

@Component({
    selector: 'app-legal-info',
    templateUrl: './legal-info.component.html',
    styleUrls: ['./legal-info.component.scss']
})
export class LegalInfoComponent {

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    back() {
        this._location.back();
    }

}
