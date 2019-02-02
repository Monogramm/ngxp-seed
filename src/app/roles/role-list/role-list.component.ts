import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger, Pagination } from '../../shared';
import { Role, RoleService } from '../../data';

@Component({
    selector: 'role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {
    @Input('filter-selected-only') showSelection: boolean = false;
    @Input('allow-selection') allowSelection: boolean = false;
    @Input('allow-edit') allowEdit: boolean = true;
    @Input('allow-delete') allowDelete: boolean = true;
    @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() loaded: EventEmitter<number> = new EventEmitter<number>();

    pagination: Pagination = new Pagination();

    constructor(public store: RoleService,
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
                    var msg: string = this._translate.instant('app.message.error.loading');
                    alert(msg);
                    this.loading.emit(false);
                    this.loaded.emit(0);
                }
            );
    }

    imageSource(role: Role) {
        if (role.deleted) {
            return role.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked'
        }
        return role.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(role: Role) {
        role.selected = !role.selected;
        return;
    }

    delete(role: Role) {
        if (!this.allowDelete) {
            return;
        }
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            role.deleting = true;

            this.store.delete(role)
                .then(
                    () => {
                        role.deleting = false;
                        role.deleted = true;
                        if (this.pagination.next) {
                            this.reload();
                        }
                    },
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

    edit(role: Role): any[] {
        if (!this.allowEdit || !!!role.id) {
            return ['.'];
        }
        return ['/role', role.id];
    }
}
