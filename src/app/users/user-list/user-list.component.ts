import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger, Pagination } from '../../shared';
import { User, UserService } from '../../data';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
    @Input() selectedUser: User;
    @Output() loaded = new EventEmitter();

    pagination: Pagination = new Pagination();

    constructor(public store: UserService,
        private _translate: TranslateService,
        private _router: Router) { }

    ngOnInit() {
        this.load(1);
    }

    load(page: number): void {
        this.pagination.page = page;

        this.store.load(this.pagination)
            .then(
                () => {
                    this.loaded.emit('loaded');
                },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this.loaded.emit('loaded');
                }
            );
    }

    delete(user: User) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            user.deleting = true;

            this.store.delete(user)
                .then(
                    () => { },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
                    }
                );
        }
    }

    edit(user: User) {
        this._router.navigate(['/user', user.id]);
    }
}
