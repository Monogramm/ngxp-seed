import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger, Pagination } from '../../shared';
import { Parameter, ParameterService } from '../../data';

@Component({
    selector: 'app-parameter-list',
    templateUrl: './parameter-list.component.html',
    styleUrls: ['./parameter-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterListComponent implements OnInit {
    @Input() selection = false;
    @Input() selectable = false;
    @Input() viewable = true;
    @Input() deletable = true;
    @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() loaded: EventEmitter<number> = new EventEmitter<number>();

    pagination: Pagination = new Pagination();

    constructor(public store: ParameterService,
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

    imageSource(parameter: Parameter) {
        if (parameter.deleted) {
            return parameter.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked';
        }
        return parameter.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(parameter: Parameter) {
        parameter.selected = !parameter.selected;
        return;
    }

    delete(parameter: Parameter) {
        if (!this.deletable) {
            return;
        }
        const msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            parameter.deleting = true;

            this.store.delete(parameter)
                .then(
                    () => {
                        parameter.deleting = false;
                        parameter.deleted = true;
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

    edit(parameter: Parameter): any[] {
        if (!this.viewable || !!!parameter.id) {
            return ['.'];
        }
        return ['/parameter', parameter.id];
    }

}
