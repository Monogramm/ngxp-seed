import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../../../x-shared/app/users';

@Component({
    selector: 'mg-verify-account',
    moduleId: module.id,
    templateUrl: './verify-account.component.html',
    styleUrls: ['./verify-account.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyAccountComponent {
    @Input() token: string;

    constructor() {
    }

    get valid(): boolean {
        return !(this.token == null);
    }
}
