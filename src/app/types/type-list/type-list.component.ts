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
    @Input() showSelection: boolean;
    @Output() loaded = new EventEmitter();

    pagination: Pagination = new Pagination();

    constructor(public store: TypeService,
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
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            type.deleting = true;

            this.store.delete(type)
                .then(
                    () => { type.deleting = false; type.deleted = true; },
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
        this._router.navigate(['/type', type.id]);
    }
}
