import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User, UserService } from '../data/users';

import { UserListComponent } from './user-list';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [UserService]
})
export class UsersComponent implements OnInit {
    isLoading = false;

    constructor(public store: UserService,
        private _router: Router) { }

    ngOnInit() {
        this.isLoading = true;
    }

    hideLoadingIndicator() {
        this.isLoading = false;
    }
}
