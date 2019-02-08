import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../shared/';
import { LoginService, User, UserDTO, UserService } from '../../data';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User;
  token: string;
  busy = false;

  constructor(public store: LoginService,
    public userService: UserService,
    private _translate: TranslateService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location) { }

  ngOnInit() {
    this._route.params.pipe(
      switchMap((params: Params) => {
        this.busy = true;
        return this.userService.get(params['id']);
      }))
      .subscribe((data: HttpResponse<UserDTO>) => {
        this.busy = false;
        this.user = this.userService.newModel(data.body);
      },
        (error) => {
          this.busy = false;
          if (Logger.isEnabled) {
            Logger.dir(error);
          }
          const msg: string = this._translate.instant('register.message.error.load_profile');
          alert(msg);
          this._location.back();
        }
      );
  }

  sendToken() {
    if (this.user.email) {
      this.busy = true;
      this.store.sendVerificationToken(this.user.email)
        .then(
          () => {
            this.busy = false;
            const msg: string = this._translate.instant('register.message.success.token_sent');
            alert(msg);
          },
          (error) => {
            this.busy = false;
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            const msg: string = this._translate.instant('register.message.error.send_token');
            alert(msg);
          }
        );
    }
  }

  submit() {
    if (!!!this.token) {
      const msg: string = this._translate.instant('register.message.warning.empty_token');
      alert(msg);
      return;
    }
    this.busy = true;
    this.store.verify(this.user.id, this.token)
      .then(
        () => {
          this.busy = false;
          this._router.navigate(['']);
        },
        (error) => {
          this.busy = false;
          if (Logger.isEnabled) {
            Logger.dir(error);
          }
          const msg: string = this._translate.instant('register.message.error.verification');
          alert(msg);
        }
      );
  }

  return() {
    this.busy = false;
    this._location.back();
  }

  get valid(): boolean {
    return !!!this.token;
  }

}
