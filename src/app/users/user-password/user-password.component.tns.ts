import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Logger } from '../../shared';
import { User, UserDTO, UserService } from '../../data/users';

import { ChangePasswordComponent } from './change-password';

@Component({
  selector: 'app-tns-user-password',
  moduleId: module.id,
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent implements OnInit {
  user: User;

  constructor(public store: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location) { }

  ngOnInit() {
    this._route.params.pipe(
      switchMap((params: Params) => this.store.get(params['id'])))
      .subscribe((data: HttpResponse<UserDTO>) => {
        this.user = this.store.newModel(data.body);
      });
  }

  submit(user: User) {
    if (confirm('Confirm password update of user "' + user.username + '" ?')) {
      this.store.update(user)
        .then(
          () => { },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            alert('An error occurred while updating a user.');
          }
        );
    }
  }

  cancel() {
    this._location.back();
  }

}
