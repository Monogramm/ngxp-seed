import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import * as utils from 'tns-core-modules/utils/utils';

import { Role, RoleService } from '../../data/roles';

import { alert } from '../../shared/dialog-util';

declare var UIColor: any;

@Component({
    selector: 'mg-role-list',
    moduleId: module.id,
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {
    @Input() showSelection: boolean;
    @Input() row;
    @Output() loading = new EventEmitter();
    @Output() loaded = new EventEmitter();

    listLoaded = false;

    constructor(private store: RoleService) {
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
                alert('An error occurred loading your role list.');
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

    icon(role: Role): string {
        if (role.deleted) {
            return String.fromCharCode(role.selected ? 0xea55 : 0xea56);
            // FIXME use fonticons classes instead of codes
            // return role.selected ? 'radio-checked2' : 'radio-unchecked';
        } else {
            return String.fromCharCode(role.selected ? 0xea52 : 0xea52);
            // FIXME use fonticons classes instead of codes
            // return role.selected ? 'checkbox-checked' : 'checkbox-unchecked';
        }
    }

    toggleSelection(role: Role): void {
        role.selected = !role.selected;
        return;
    }

    delete(role: Role): void {
        var confirmation: any = confirm('Confirm deletion of role "' + role.name + '" ?');

        let deleteConfirmed = () => {
            this.loading.next('');
            let successHandler = () => {
                role.deleting = false;
                role.deleted = true;
                this.loaded.next('');
            };
            let errorHandler = () => {
                alert('An error occurred while deleting "' + role.name + '".');
                this.loaded.next('');
            };

            this.store.delete(role)
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
