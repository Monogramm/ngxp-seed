import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Color } from 'tns-core-modules/color';
import { action } from 'tns-core-modules/ui/dialogs';
import { Page } from 'tns-core-modules/ui/page';
import { TextField } from 'tns-core-modules/ui/text-field';

import * as SocialShare from 'nativescript-social-share';

import { LoginService } from '../data';
import { Media, MediaService } from '../data/media';

import { alert } from '../shared/dialog-util';

import { MediaListComponent } from './media-list/media-list.component';

@Component({
    selector: 'app-tns-media',
    moduleId: module.id,
    templateUrl: './media.component.html',
    styleUrls: ['./media.component-common.css', './media.component.css']
})
export class MediaComponent implements OnInit {
    media: Media = new Media();
    isAndroid;
    isConfirmingDeletion = false;
    isLoading = false;

    @ViewChild('mediaTextField') mediaTextField: ElementRef;

    constructor(private _router: Router,
        private _store: MediaService,
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
        // If showing recent media the add button should do nothing.
        if (this.isConfirmingDeletion) {
            this.cancelMassDelete();
            return;
        }

        const textField = <TextField>this.mediaTextField.nativeElement;

        if (this.media.name.trim() === '') {
            // If the user clicked the add button, and the textfield is empty,
            // focus the text field and return.
            if (target === 'button') {
                textField.focus();
            } else {
                // If the user clicked return with an empty text field show an error.
                alert('Enter a media item');
            }
            return;
        }

        // Dismiss the keyboard
        // TODO: Is it better UX to dismiss the keyboard, or leave it up so the
        // user can continue to add more media?
        textField.dismissSoftInput();

        this.showActivityIndicator();
        this._store.add(this.media)
            .then(
                () => {
                    this.media = new Media();
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
            const result = this._store.deleteSelection();

            if (result) {
                result.then(
                    () => {
                        this.isConfirmingDeletion = false;
                        this.hideActivityIndicator();
                    },
                    () => {
                        alert('An error occurred while deleting media.');
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
        const items = this._store.items.value;
        const list = [];
        for (let i = 0, size = items.length; i < size; i++) {
            list.push(items[i].name);
        }
        SocialShare.shareText(list.join(', ').trim());
    }

    logoff(): void {
        this._loginService.logout();
    }
}
