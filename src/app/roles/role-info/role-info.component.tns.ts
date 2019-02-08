import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Logger } from '../../shared';
import { Role, RoleDTO, RoleService } from '../../data';

import { RoleDetailsComponent } from './role-details';

@Component({
  selector: 'app-tns-role-info',
  templateUrl: './role-info.component.html',
  styleUrls: ['./role-info.component.scss']
})
export class RoleInfoComponent implements OnInit {
  role: Role;

  constructor(public store: RoleService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location) { }

  ngOnInit() {
    this._route.params.pipe(
      switchMap((params: Params) => this.store.get(params['id'])))
      .subscribe((data: HttpResponse<RoleDTO>) => {
        this.role = this.store.newModel(data.body);
      },
        (error) => {
          if (Logger.isEnabled) {
            Logger.dir(error);
          }
          alert('An error occurred while loading a role.');
          this._location.back();
        });
  }

  delete(role: Role) {
    if (confirm('Confirm deletion of role "' + role.name + '" ?')) {
      role.deleting = true;

      this.store.delete(role)
        .then(
          () => { },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            alert('An error occurred while deleting a role.');
          }
        );
    }
  }

  submit(role: Role) {
    if (role.id === null) {
      this.store.add(role.name)
        .then(
          () => { this._location.back(); },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            alert('An error occurred while adding an role.');
          }
        );
    } else {
      this.store.update(role)
        .then(
          () => { this._location.back(); },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            alert('An error occurred while updating a role.');
          }
        );
    }
  }

  cancel() {
    this._location.back();
  }

}
