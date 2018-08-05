import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { action } from 'ui/dialogs';
import { Color } from 'color';
import { Page } from 'ui/page';
import { TextField } from 'ui/text-field';
import * as SocialShare from 'nativescript-social-share';

import { Logger } from '../../x-shared/app/shared';
import { ParameterService } from '../../x-shared/app/parameters';
import { LoginService } from '../../x-shared/app/login';

import { alert } from '../shared';

import { ParameterListComponent } from './parameter-list/parameter-list.component';

@Component({
    selector: 'mg-parameters',
    moduleId: module.id,
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters-common.css', './parameters.component.css']
})
export class ParametersComponent implements OnInit {
    parameter: string = '';
    isAndroid;
    isConfirmingDeletion = false;
    isLoading = false;

    @ViewChild('parameterTextField') parameterTextField: ElementRef;

    constructor(private _router: Router,
        private _store: ParameterService,
        private _loginService: LoginService,
        private _page: Page) { }

    ngOnInit(): void {
        this.isAndroid = !!this._page.android;
        this._page.actionBarHidden = true;
        this._page.className = 'list-page';
    }

    // Prevent the first textfield from receiving focus on Android
    // See http://stackoverflow.com/questions/5056734/android-force-edittext-to-remove-focus
    handleAndroidFocus(textField, container): void {
        if (container.android) {
            container.android.setFocusableInTouchMode(true);
            container.android.setFocusable(true);
            textField.android.clearFocus();
        }
    }

    showActivityIndicator(): void {
        this.isLoading = true;
    }
    hideActivityIndicator(): void {
        this.isLoading = false;
    }

    add(target: string): void {
        // If showing recent parameters the add button should do nothing.
        if (this.isConfirmingDeletion) {
            this.cancelMassDelete();
            return;
        }

        let textField = <TextField>this.parameterTextField.nativeElement;

        if (this.parameter.trim() === '') {
            // If the user clicked the add button, and the textfield is empty,
            // focus the text field and return.
            if (target === 'button') {
                textField.focus();
            } else {
                // If the user clicked return with an empty text field show an error.
                alert('Enter a parameter item');
            }
            return;
        }

        // Dismiss the keyboard
        // TODO: Is it better UX to dismiss the keyboard, or leave it up so the
        // user can continue to add more parameters?
        textField.dismissSoftInput();

        this.showActivityIndicator();
        this._store.add(this.parameter)
            .then(
            () => {
                this.parameter = '';
                this.hideActivityIndicator();
            },
            () => {
                alert('An error occurred while adding an item to your list.');
                this.hideActivityIndicator();
            }
            );
    }

    cancelMassDelete(): void {
        this.isConfirmingDeletion = false;
        this._store.updateSelection(this.isConfirmingDeletion);
    }

    toggleMassDelete(): void {
        if (this.isConfirmingDeletion) {
            this.showActivityIndicator();
            let result = this._store.deleteSelection();

            if (result) {
                result.then(
                    () => {
                        this.isConfirmingDeletion = false;
                        this.hideActivityIndicator();
                    },
                    () => {
                        alert('An error occurred while deleting parameters.');
                        this.hideActivityIndicator();
                    }
                );
            } else {
                this.isConfirmingDeletion = false;
                this.hideActivityIndicator();
            }
        } else {
            this.isConfirmingDeletion = true;
        }
    }

    showMenu(): void {
        action({
            message: 'What would you like to do?',
            actions: ['Share', 'Log Off'],
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result === 'Share') {
                this.share();
            } else if (result === 'Log Off') {
                this.logoff();
            }
        });
    }

    share(): void {
        let items = this._store.items.value;
        let list = [];
        for (let i = 0, size = items.length; i < size; i++) {
            list.push(items[i].name);
        }
        SocialShare.shareText(list.join(', ').trim());
    }

    logoff(): void {
        this._loginService.logoff();
        this._router.navigate(['/login']);
    }
}
