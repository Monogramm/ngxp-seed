import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../../../x-shared/app/shared';
import { User, UserService } from '../../../x-shared/app/users';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
    @Input() selectedUser: User;
    @Output() loaded = new EventEmitter();

    constructor(public store: UserService,
        private _router: Router) { }

    ngOnInit() {
        this.store.load()
            .then(() => this.loaded.emit('loaded'));
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

    edit(user: User) {
        this._router.navigate(['/user', user.id]);
    }
}
