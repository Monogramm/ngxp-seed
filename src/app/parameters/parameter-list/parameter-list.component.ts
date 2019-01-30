import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger, Pagination } from '../../shared';
import { Parameter, ParameterService } from '../../data';

@Component({
    selector: 'parameter-list',
    templateUrl: './parameter-list.component.html',
    styleUrls: ['./parameter-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterListComponent {
    @Input() showSelection: boolean;
    @Output() loaded = new EventEmitter();

    pagination: Pagination = new Pagination();

    constructor(public store: ParameterService,
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

    imageSource(parameter: Parameter) {
        if (parameter.deleted) {
            return parameter.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked'
        }
        return parameter.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(parameter: Parameter) {
        parameter.selected = !parameter.selected;
        return;
    }

    delete(parameter: Parameter) {
        var msg: string = this._translate.instant('app.message.confirm.delete');
        if (confirm(msg)) {
            parameter.deleting = true;

            this.store.delete(parameter)
                .then(
                    () => { parameter.deleting = false; parameter.deleted = true; },
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

    edit(parameter: Parameter) {
        this._router.navigate(['/parameter', parameter.id]);
    }
}
