import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger, Pagination } from '../../shared';
import { User, UserService } from '../../data';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
    @Input() viewable = true;
    @Input() deletable = true;
    @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() loaded: EventEmitter<number> = new EventEmitter<number>();

    pagination: Pagination = new Pagination();

    constructor(public store: UserService,
        private _translate: TranslateService,
        private _router: Router) { }

    ngOnInit() {
        this.load(1);
    }

    reload(): void {
        this.load(this.pagination.page);
    }

    load(page: number): void {
        this.pagination.page = page;

        this.loading.emit(true);
        this.store.load(this.pagination)
            .then(
                () => {
                    this.loading.emit(false);
                    this.loaded.emit(this.store.count);
                },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    const errMsg: string = this._translate.instant('app.message.error.loading');
                    alert(errMsg);
                    this.loading.emit(false);
                    this.loaded.emit(0);
                }
            );
    }

    delete(user: User) {
        if (!this.deletable) {
            return;
        }
        const msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            user.deleting = true;

            this.store.delete(user)
                .then(
                    () => {
                        user.deleting = false;
                        user.deleted = true;
                        if (this.pagination.next) {
                            this.reload();
                        }
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        const errMsg: string = this._translate.instant('app.message.error.deletion');
                        alert(errMsg);
                    }
                );
        }
    }

    edit(user: User): any[] {
        if (!this.viewable || !!!user.id) {
            return ['.'];
        }
        return ['/user', user.id];
    }
}
