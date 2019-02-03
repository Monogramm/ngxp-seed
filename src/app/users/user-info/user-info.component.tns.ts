import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { action } from 'tns-core-modules/ui/dialogs';
import { Frame } from 'tns-core-modules/ui/frame';
import { Page } from 'tns-core-modules/ui/page';
import { TextField } from 'tns-core-modules/ui/text-field';

import { Color } from 'tns-core-modules/color';

import * as SocialShare from 'nativescript-social-share';

import { Logger } from '../../shared';
import { UserService, User } from '../../data/users';
import { LoginService } from '../../data/login';

import { alert } from '../../shared/dialog-util';

import { UserDetailsComponent } from './user-details/user-details.component';

@Component({
    selector: 'app-tns-user-info',
    moduleId: module.id,
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component-common.css', './user-info.component.css'],
    providers: [UserService, LoginService]
})
export class UserInfoComponent implements OnInit {
    user: User;
    isAndroid;
    isShowingRecent = false;
    isLoading = false;

    constructor(public store: UserService,
        private _translate: TranslateService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _loginService: LoginService,
        private _page: Page) { }

    ngOnInit() {
        this.isAndroid = !!this._page.android;
        this._page.actionBarHidden = true;
        this._page.className = 'list-page';

        this._route.params.pipe(
            switchMap((params: Params) => this.store.get(params['id'])))
            .subscribe((data: any) => {
                Logger.dir(data);
                this.user = this.store.newModel(data);
                Logger.dir(this.user);
            });
    }

    // Prevent the first textfield from receiving focus on Android
    // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
    handleAndroidFocus(textField, container) {
        if (container.android) {
            container.android.setFocusableInTouchMode(true);
            container.android.setFocusable(true);
            textField.android.clearFocus();
        }
    }

    showActivityIndicator() {
        this.isLoading = true;
    }
    hideActivityIndicator() {
        this.isLoading = false;
    }

    delete(user: User) {
        if (confirm('Confirm deletion of user "' + user.username + '" ?')) {
            user.deleting = true;

            this.showActivityIndicator();
            this.store.delete(user)
                .then(
                    () => this.hideActivityIndicator(),
                    () => {
                        alert('An error occurred while deleting a user.');
                        this.hideActivityIndicator();
                    }
                );
        }
    }

    submit(user: User) {
        this.showActivityIndicator();
        if (user.id === null) {
            this.store.add(user)
                .then(
                    () => this.hideActivityIndicator(),
                    () => {
                        alert('An error occurred while adding an user.');
                        this.hideActivityIndicator();
                    }
                );
        } else {
            this.store.update(user)
                .then(
                    () => this.hideActivityIndicator(),
                    () => {
                        alert('An error occurred while updating a user.');
                        this.hideActivityIndicator();
                    }
                );
        }
    }

    showMenu() {
        action({
            message: 'What would you like to do?',
            actions: ['Log Off'],
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result === 'Log Off') {
                this.logoff();
            }
        });
    }

    cancel() {
        // TODO
    }

    logoff() {
        this._loginService.logout();
    }
}
