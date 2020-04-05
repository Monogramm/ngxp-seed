import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { AppService } from '../app.service';
import { Logger } from '@xapp/shared';
import { User } from '@xapp/users/user.model';
import { LoginService } from '@xapp/login'
import { AuthService } from '@xapp/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User;
  isLoggingIn = true;
  isAuthenticating = false;

  tosAccepted = false;

  public readonly appName: string = AppService.APP_NAME;

  constructor(
    private loginService: LoginService,
    private _authService: AuthService,
    private _translate: TranslateService,
    private _router: Router) {
    this.user = new User();
  }

  submit() {
    if (!this.user.isValidEmail()) {
      const msg: string = this._translate.instant('login.message.warning.valid_email');
      alert(msg);
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
    this.loginService.login(this.user)
      .then(
        (user) => {
          this.isAuthenticating = false;

          if (!user.verified) {
            // Request user account verification
            this._router.navigate(['register', user.id]);
          } else {
            this._router.navigate(['']);
          }
        },
        (error) => {
          if (Logger.isEnabled) {
            Logger.log('Login error');
            Logger.dir(error);
          }
          this.isAuthenticating = false;
          const msg: string = this._translate.instant('login.message.error.login');
          alert(msg);
        }
      );
  }

  initUsername() {
    if (this.user.email) {
      const indexOfAtSign: number = this.user.email.indexOf('@');
      let username: string;
      if (indexOfAtSign > 0) {
        username = this.user.email.substr(0, indexOfAtSign);
      } else {
        username = this.user.email;
      }
      this.user.username = username;
    }
  }

  signUp() {
    if (!!!this.user.username) {
      this.initUsername();
    }

    if (!!!this.tosAccepted) {
      const msg: string = this._translate.instant('login.message.warning.accept_tos');
      alert(msg);
      return;
    }

    this.loginService.register(this.user)
      .then(
        () => {
          const msg: string = this._translate.instant('login.message.success.signup');
          alert(msg);
          this.isAuthenticating = false;
          this.toggleDisplay();
        },
        (error) => {
          if (Logger.isEnabled) {
            Logger.log('Registration error');
            Logger.dir(error);
          }
          this.isAuthenticating = false;
          const msg: string = this._translate.instant('login.message.error.signup');
          alert(msg);
        }
      );
  }

  forgotPassword() {
    this._router.navigate(['reset-password']);
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }

}
