import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import * as utils from 'utils/utils';

import { Type, TypeService } from '../../../x-shared/app/types';
import { alert } from '../../shared';

declare var UIColor: any;

@Component({
    selector: 'mg-type-list',
    moduleId: module.id,
    templateUrl: './type-list.component.html',
    styleUrls: ['./type-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypeListComponent {
    @Input() showSelection: boolean;
    @Input() row;
    @Output() loading = new EventEmitter();
    @Output() loaded = new EventEmitter();

    listLoaded = false;

    constructor(private _store: TypeService) {
    }

    load(): void {
        this.loading.next('');
        this._store.load()
            .then(
            () => {
                this.loaded.next('');
                this.listLoaded = true;
            },
            () => {
                alert('An error occurred loading your type list.');
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

    icon(type: Type): string {
        if (type.deleted) {
            return String.fromCharCode(type.selected ? 0xea55 : 0xea56);
            // FIXME use fonticons classes instead of codes
            // return type.selected ? 'radio-checked2' : 'radio-unchecked';
        } else {
            return String.fromCharCode(type.selected ? 0xea52 : 0xea56);
            // FIXME use fonticons classes instead of codes
            // return type.selected ? 'checkbox-checked' : 'checkbox-unchecked';
        }
    }

    toggleSelection(type: Type): void {
        type.selected = !type.selected;
        return;
    }

    delete(type: Type): void {
        var confirmation: any = confirm('Confirm deletion of type "' + type.name + '" ?');

        let deleteConfirmed = () => {
            this.loading.next('');
            let successHandler = () => {
                type.deleting = false;
                type.deleted = true;
                this.loaded.next('');
            };
            let errorHandler = () => {
                alert('An error occurred while deleting "' + type.name + '".');
                this.loaded.next('');
            };

            this._store.delete(type)
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

