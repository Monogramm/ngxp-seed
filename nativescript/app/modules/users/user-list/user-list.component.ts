import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as utils from 'utils/utils';

import { UserService, User } from '../../../x-shared/app/users';

import { alert } from '../../shared';

declare var UIColor: any;

@Component({
    selector: 'mg-user-list',
    moduleId: module.id,
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
    @Input() row;
    @Output() loading = new EventEmitter();
    @Output() loaded = new EventEmitter();

    public store: UserService;
    listLoaded = false;

    constructor(store: UserService,
        private _router: Router) {
        this.store = store;
    }

    load(): void {
        this.loading.next('');
        this.store.load()
            .subscribe(
            () => {
                this.loaded.next('');
                this.listLoaded = true;
            },
            () => {
                alert('An error occurred loading the user list.');
            }
            );
    }

    // The following trick makes the background color of each cell
    // in the UITableView transparent as it’s created.
    makeBackgroundTransparent(args): void {
        let cell = args.ios;
        if (cell) {
            // support XCode 8
            cell.backgroundColor = utils.ios.getter(UIColor, UIColor.clearColor);
        }
    }

    delete(user: User): void {
        if (confirm('Confirm deletion of user "' + user.username + '" ?')) {
            this.loading.next('');
            user.deleting = true;

            this.store.delete(user)
                .then(
                () => { },
                () => alert('An error occurred while deleting a user.')
                );
        }
    }

    edit(user: User): void {
        this._router.navigate(['/user', user.id]);
    }
}

