import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '@xapp/users';

@Component({
    selector: 'verify-account',
    templateUrl: './verify-account.component.html',
    styleUrls: ['./verify-account.component.scss'],
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
