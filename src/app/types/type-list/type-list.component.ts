import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger, Pagination } from '../../shared';
import { Type, TypeService } from '../../data';

@Component({
    selector: 'type-list',
    templateUrl: './type-list.component.html',
    styleUrls: ['./type-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeListComponent {
    @Input('filter-selected-only') showSelection: boolean = false;
    @Input('allow-edit') allowEdit: boolean = true;
    @Input('allow-delete') allowDelete: boolean = true;
    @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() loaded: EventEmitter<number> = new EventEmitter<number>();

    pagination: Pagination = new Pagination();

    constructor(public store: TypeService,
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

    imageSource(type: Type) {
        if (type.deleted) {
            return type.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked'
        }
        return type.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(type: Type) {
        type.selected = !type.selected;
        return;
    }

    delete(type: Type) {
        if (!this.allowDelete) {
            return;
        }
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            type.deleting = true;

            this.store.delete(type)
                .then(
                    () => {
                        type.deleting = false;
                        type.deleted = true;
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

    edit(type: Type) {
        if (!this.allowEdit) {
            return;
        }
        this._router.navigate(['/type', type.id]);
    }
}
