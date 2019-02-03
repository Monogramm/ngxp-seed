import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Color } from 'tns-core-modules/color';
import { connectionType, getConnectionType } from 'tns-core-modules/connectivity';

import { Animation } from 'tns-core-modules/ui/animation';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from 'tns-core-modules/ui/page';
import { TextField } from 'tns-core-modules/ui/text-field';

import { AppService } from '../app.service';
import { Logger } from '../shared';
import { User, LoginService } from '../data';

import { alert } from '../shared/dialog-util';

@Component({
    selector: 'app-tns-login',
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component-common.css', './login.component.css'],
    providers: [LoginService]
})
export class LoginComponent implements OnInit {
    user: User;
    isLoggingIn = true;
    isAuthenticating = false;

    readonly appName = AppService.APP_NAME;

    @ViewChild('initialContainer') initialContainer: ElementRef;
    @ViewChild('mainContainer') mainContainer: ElementRef;
    @ViewChild('logoContainer') logoContainer: ElementRef;
    @ViewChild('formControls') formControls: ElementRef;
    @ViewChild('signUpStack') signUpStack: ElementRef;
    @ViewChild('password') password: ElementRef;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private page: Page) {
        this.user = new User();
    }

    ngOnInit() {
        this.page.actionBarHidden = true;
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
            alert(AppService.APP_NAME + ' requires an internet connection to log in.');
            return;
        }

        this.loginService.login(this.user)
            .then(
            () => {
                this.isAuthenticating = false;
                this.router.navigate(['']);
            },
            (error) => {
                alert('Unfortunately we could not find your account or password.');
                this.isAuthenticating = false;
            }
            );
    }

    signUp() {
        if (getConnectionType() === connectionType.none) {
            alert(AppService.APP_NAME + ' requires an internet connection to register.');
            return;
        }

        this.loginService.register(this.user)
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
        this.router.navigate(['reset-password']);
    }

    toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
        const mainContainer = <View>this.mainContainer.nativeElement;
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
        const initialContainer = <View>this.initialContainer.nativeElement;
        const mainContainer = <View>this.mainContainer.nativeElement;
        const logoContainer = <View>this.logoContainer.nativeElement;
        const formControls = <View>this.formControls.nativeElement;
        const signUpStack = <View>this.signUpStack.nativeElement;
        const animations = [];

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
