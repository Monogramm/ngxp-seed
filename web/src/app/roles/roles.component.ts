import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Role, RoleService } from '@xapp/roles';
import { BackendService } from '@xapp/core';

import { Logger } from '@xapp/shared';

import { RoleListComponent } from './role-list';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
    role = '';

    selectable = false;

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
            const msg: string = this._translate.instant('app.message.warning.missing_field');
            alert(msg);
            return;
        }

        this._store.add(this.role).then(() => {
            this.role = '';
        }, (error) => {
            if (Logger.isEnabled) {
                Logger.dir(error);
            }
            const errMsg: string = this._translate.instant('app.message.error.creation');
            alert(errMsg);
        });
    }

    cancelMassDelete() {
        this.isConfirmingDeletion = false;
        this._store.updateSelection(this.isConfirmingDeletion);
    }

    toggleMassDelete() {
        if (this.isConfirmingDeletion) {
            const result = this._store.deleteSelection();

            if (result) {
                result.then(
                    () => {
                        this.isConfirmingDeletion = false;
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        const errMsg: string = this._translate.instant('app.message.error.deletion');
                        alert(errMsg);
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
