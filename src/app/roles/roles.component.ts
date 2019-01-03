import { Component, OnInit } from '@angular/core';

import { Role, RoleService } from '../data/roles';

import { Logger } from '../shared';

import { RoleListComponent } from './role-list';

@Component({
    selector: 'roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
    role: string = '';

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(private _store: RoleService) { }

    ngOnInit() {
        this.isLoading = true;
    }

    hideLoadingIndicator() {
        this.isLoading = false;
    }

    add() {
        if (this.role.trim() === '') {
            alert('Enter a role item');
            return;
        }

        this._store.add(this.role).then(() => {
            this.role = '';
        }, (error) => {
            if (Logger.isEnabled) {
                Logger.dir(error);
            }
            alert('An error occurred while adding a role to your list.');
        });
    }

    cancelMassDelete() {
        this.isConfirmingDeletion = false;
        this._store.updateSelection(this.isConfirmingDeletion);
    }

    toggleMassDelete() {
        if (this.isConfirmingDeletion) {
            let result = this._store.deleteSelection();
            
            if (result) {
                result.then(
                    () => { this.isConfirmingDeletion = false },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        alert('An error occurred while deleting roles.');
                    }
                );
            } else {
                this.isConfirmingDeletion = false;
            }
        } else {
            this.isConfirmingDeletion = true;
        }
    }
}
