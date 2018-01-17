import { Component } from '@angular/core';

import { SwissArmyKnife } from 'nativescript-swiss-army-knife';

import { TNSFontIconService } from 'nativescript-ngx-fonticon';

import { Logger } from '../x-shared/app/shared';

@Component({
    selector: 'my-app',
    template: `<page-router-outlet></page-router-outlet>`
})
export class AppComponent {

    constructor(private fonticon: TNSFontIconService) {
        // Setting $c-secondary color to android statusBar.
        SwissArmyKnife.setAndroidStatusBarColor('#2e008b');

        // Setting StatusBarStyle to UIBarStyleBlack for iOS.
        SwissArmyKnife.actionBarSetStatusBarStyle(1);
    }
}
