import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../../../x-shared/app/shared';
import { Parameter, ParameterService } from '../../../x-shared/app/parameters';

@Component({
    selector: 'parameter-list',
    templateUrl: './parameter-list.component.html',
    styleUrls: ['./parameter-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterListComponent {
    @Input() showSelection: boolean;
    @Output() loaded = new EventEmitter();

    constructor(private _store: ParameterService,
        private _router: Router) { }

    ngOnInit() {
        this._store.load()
            .then(
            () => this.loaded.emit('loaded'),
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while loading items.');
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
        if (confirm('Confirm deletion of parameter "' + parameter.name + '" ?')) {
            parameter.deleting = true;

            this._store.delete(parameter)
                .then(
                () => { parameter.deleting = false; parameter.deleted = true; },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while deleting an item.');
                }
                );
        }
    }

    edit(parameter: Parameter) {
        this._router.navigate(['/parameter', parameter.id]);
    }
}
