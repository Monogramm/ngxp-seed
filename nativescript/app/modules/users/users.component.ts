import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { action } from 'ui/dialogs';
import { Color } from 'color';
import { Page } from 'ui/page';
import { TextField } from 'ui/text-field';
import * as SocialShare from 'nativescript-social-share';

import { Logger } from '../../x-shared/app/shared';
import { UserService, User } from '../../x-shared/app/users';
import { LoginService } from '../../x-shared/app/login';

import { alert } from '../shared';

import { UserListComponent } from './user-list/user-list.component';

@Component({
    selector: 'mg-users',
    moduleId: module.id,
    templateUrl: './users.component.html',
    styleUrls: ['./users-common.css', './users.component.css'],
    providers: [UserService, LoginService]
})
export class UsersComponent implements OnInit {
    user: User;
    isAndroid;
    isShowingRecent = false;
    isLoading = false;

    @ViewChild('userTextField') userTextField: ElementRef;

    constructor(private _router: Router,
        private _store: UserService,
        private _loginService: LoginService,
        private _page: Page) { }

    ngOnInit() {
        this.isAndroid = !!this._page.android;
        this._page.actionBarHidden = true;
        this._page.className = 'list-page';
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

            this._store.delete(user)
                .then(
                () => { },
                () => alert('An error occurred while deleting a user.')
                );
        }
    }

    edit(user: User) {
        this._router.navigate(['/user', user.id]);
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

    logoff() {
        this._loginService.logoff();
        this._router.navigate(['/login']);
    }
}
