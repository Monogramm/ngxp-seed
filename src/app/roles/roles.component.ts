import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

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

    allowSelection: boolean = false;

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(
        private _translate: TranslateService,
        private _store: RoleService) { }

    ngOnInit() {
        this.isLoading = true;
    }

    hideLoadingIndicator() {
        this.isLoading = false;
    }

    add() {
        if (this.role.trim() === '') {
            var msg: string = this._translate.instant('app.message.warning.missing_field');
            alert(msg);
            return;
        }

        this._store.add(this.role).then(() => {
            this.role = '';
        }, (error) => {
            if (Logger.isEnabled) {
                Logger.dir(error);
            }
            var msg: string = this._translate.instant('app.message.error.creation');
            alert(msg);
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
                        var msg: string = this._translate.instant('app.message.error.deletion');
                        alert(msg);
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
