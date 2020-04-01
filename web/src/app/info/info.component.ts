import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Logger } from '@xapp/shared';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent {

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    back() {
        this._location.back();
    }

}
