import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Type, TypeService } from '../data/types';

import { Logger } from '../shared';

import { TypeListComponent } from './type-list';

@Component({
    selector: 'types',
    templateUrl: './types.component.html',
    styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {
    type: string = '';

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(
        private _translate: TranslateService,
        private _store: TypeService) { }

    ngOnInit() {
        this.isLoading = true;
    }

    hideLoadingIndicator() {
        this.isLoading = false;
    }

    add() {
        if (this.type.trim() === '') {
            var msg: string = this._translate.instant('app.message.warning.missing_field');
            alert(msg);
            return;
        }

        this._store.add(this.type)
            .then(() => {
                this.type = '';
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
