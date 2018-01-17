import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Color } from 'color';
import { connectionType, getConnectionType } from 'connectivity';

import { Animation } from 'ui/animation';
import { View } from 'ui/core/view';
import { prompt } from 'ui/dialogs';
import { Page } from 'ui/page';
import { TextField } from 'ui/text-field';

import { User } from '../../x-shared/app/users';
import { AppResources } from '../../x-shared/app/shared/app-resources';
import { LoginService } from '../../x-shared/app/login';

import { alert } from '../shared';

@Component({
    selector: 'mg-login',
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls: ['./login-common.css', './login.component.css'],
    providers: [LoginService]
})
export class LoginComponent implements OnInit {
    user: User;
    isLoggingIn = true;
    isAuthenticating = false;

    readonly appName = AppResources.appName.toUpperCase();

    @ViewChild('initialContainer') initialContainer: ElementRef;
    @ViewChild('mainContainer') mainContainer: ElementRef;
    @ViewChild('logoContainer') logoContainer: ElementRef;
    @ViewChild('formControls') formControls: ElementRef;
    @ViewChild('signUpStack') signUpStack: ElementRef;
    @ViewChild('password') password: ElementRef;

    constructor(private _router: Router,
        private _loginService: LoginService,
        private _page: Page) {
        this.user = new User();
    }

    ngOnInit() {
        this._page.actionBarHidden = true;
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }

    submit() {
        if (!this.user.isValidEmail()) {
            alert('Enter a valid email address.');
            return;
        }

        this.isAuthenticating = true;
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.signUp();
        }
    }

    login() {
        if (getConnectionType() === connectionType.none) {
            alert(AppResources.appName + ' requires an internet connection to log in.');
            return;
        }

        this._loginService.login(this.user)
            .then(
            () => {
                this.isAuthenticating = false;
                this._router.navigate(['']);
            },
            (error) => {
                alert('Unfortunately we could not find your account or password.');
                this.isAuthenticating = false;
            }
            );
    }

    signUp() {
        if (getConnectionType() === connectionType.none) {
            alert(AppResources.appName + ' requires an internet connection to register.');
            return;
        }

        this._loginService.register(this.user)
            .then(
            () => {
                alert('Your account was successfully created. An email has been sent to activate your account.');
                this.isAuthenticating = false;
                this.toggleDisplay();
            },
            (error) => {
                // TODO: Verify this works
                if (error.match(/same user/)) {
                    alert('This email address is already in use.');
                } else {
                    alert('Unfortunately we were unable to create your account.');
                }
                this.isAuthenticating = false;
            }
            );
    }

    forgotPassword() {
        this._router.navigate(['reset_password']);
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
        let mainContainer = <View>this.mainContainer.nativeElement;
        mainContainer.animate({
            backgroundColor: this.isLoggingIn ? new Color('white') : new Color('#301217'),
            duration: 200
        });
    }

    startBackgroundAnimation(background) {
        background.animate({
            scale: { x: 1.0, y: 1.0 },
            duration: 10000
        });
    }

    showMainContent() {
        let initialContainer = <View>this.initialContainer.nativeElement;
        let mainContainer = <View>this.mainContainer.nativeElement;
        let logoContainer = <View>this.logoContainer.nativeElement;
        let formControls = <View>this.formControls.nativeElement;
        let signUpStack = <View>this.signUpStack.nativeElement;
        let animations = [];

        // Fade out the initial content over one half second
        initialContainer.animate({
            opacity: 0,
            duration: 500
        }).then(function () {
            // After the animation completes, hide the initial container and
            // show the main container and logo. The main container and logo will
            // not immediately appear because their opacity is set to 0 in CSS.
            initialContainer.style.visibility = 'collapse';
            mainContainer.style.visibility = 'visible';
            logoContainer.style.visibility = 'visible';

            // Fade in the main container and logo over one half second.
            animations.push({ target: mainContainer, opacity: 1, duration: 500 });
            animations.push({ target: logoContainer, opacity: 1, duration: 500 });

            // Slide up the form controls and sign up container.
            animations.push({ target: signUpStack, translate: { x: 0, y: 0 }, opacity: 1, delay: 500, duration: 150 });
            animations.push({ target: formControls, translate: { x: 0, y: 0 }, opacity: 1, delay: 650, duration: 150 });

            // Kick off the animation queue
            new Animation(animations, false).play();
        });
    }
}
