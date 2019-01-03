import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import * as utils from 'tns-core-modules/utils/utils';

import { Parameter, ParameterService } from '../../data/parameters';

import { alert } from '../../shared/dialog-util';

declare var UIColor: any;

@Component({
    selector: 'mg-parameter-list',
    moduleId: module.id,
    templateUrl: './parameter-list.component.html',
    styleUrls: ['./parameter-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterListComponent {
    @Input() showSelection: boolean;
    @Input() row;
    @Output() loading = new EventEmitter();
    @Output() loaded = new EventEmitter();

    listLoaded = false;

    constructor(private store: ParameterService) {
    }

    load(): void {
        this.loading.next('');
        this.store.load()
            .then(
            () => {
                this.loaded.next('');
                this.listLoaded = true;
            },
            () => {
                alert('An error occurred loading your parameter list.');
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

    icon(parameter: Parameter): string {
        if (parameter.deleted) {
            return String.fromCharCode(parameter.selected ? 0xea55 : 0xea56);
            // FIXME use fonticons classes instead of codes
            // return parameter.selected ? 'radio-checked2' : 'radio-unchecked';
        } else {
            return String.fromCharCode(parameter.selected ? 0xea52 : 0xea56);
            // FIXME use fonticons classes instead of codes
            // return parameter.selected ? 'checkbox-checked' : 'checkbox-unchecked';
        }
    }

    toggleSelection(parameter: Parameter): void {
        parameter.selected = !parameter.selected;
        return;
    }

    delete(parameter: Parameter): void {
        var confirmation: any = confirm('Confirm deletion of parameter "' + parameter.name + '" ?');

        let deleteConfirmed = () => {
            this.loading.next('');
            let successHandler = () => {
                parameter.deleting = false;
                parameter.deleted = true;
                this.loaded.next('');
            };
            let errorHandler = () => {
                alert('An error occurred while deleting "' + parameter.name + '".');
                this.loaded.next('');
            };

            this.store.delete(parameter)
                .then(successHandler, errorHandler);
        };

        if (confirmation === true) {
            deleteConfirmed();
        } else if (confirmation instanceof Promise) {
            (confirmation as any)
                .then((result: boolean) => {
                    if (result === true) {
                        deleteConfirmed();
                    }
                });
        }
    }
}

