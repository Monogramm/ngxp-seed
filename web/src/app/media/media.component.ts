import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Media, MediaService } from '@xapp/media';

import { Logger } from '@xapp/shared';

import { MediaListComponent } from './media-list';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
    media = '';

    selectable = false;

    isLoading = false;
    isConfirmingDeletion = false;

    constructor(
        private _translate: TranslateService,
        private _store: MediaService) { }

    ngOnInit() {
        this.isLoading = true;
    }

    hideLoadingIndicator() {
        this.isLoading = false;
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
