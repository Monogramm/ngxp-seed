import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared';

@Component({
    selector: 'app-install-info',
    templateUrl: './install-info.component.html',
    styleUrls: ['./install-info.component.scss']
})
export class InstallInfoComponent implements OnDestroy, AfterViewInit {

    subscription: Subscription;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    public ngAfterViewInit(): void {
        this.subscription = this._route.fragment
            .subscribe(fragment => {
                const targetElement = document.querySelector('#' + fragment);
                if (fragment && targetElement) {
                    targetElement.scrollIntoView();
                } else {
                    window.scrollTo(0, 0);
                }
            });
    }
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    back() {
        this._location.back();
    }

}
