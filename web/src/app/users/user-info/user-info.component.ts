import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Logger } from '../../../x-shared/app/shared';
import { User, UserService } from '../../../x-shared/app/users';

import { UserDetailsComponent } from './user-details';

@Component({
    selector: 'user',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
    user: User;

    constructor(public store: UserService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params
            .switchMap((params: Params) => this.store.get(params['id']))
            .subscribe((data: any) => {
                this.user = this.store.newModel(data);
            },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while loading the profile information.');
                this._location.back();
            }
        );
    }

    delete(user: User) {
        if (confirm('Confirm deletion of user "' + user.username + '" ?')) {
            user.deleting = true;

            this.store.delete(user)
                .then(
                () => { },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while deleting a user.');
                }
                );
        }
    }

    submit(user: User) {
        if (user.id === null && confirm('Confirm creation of user "' + user.username + '" ?')) {
            this.store.add(user)
                .then(
                () => { },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while adding an user.');
                }
                );
        } else if (confirm('Confirm update of user "' + user.username + '" ?')) {
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
