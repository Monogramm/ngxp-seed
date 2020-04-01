import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '@xapp/users';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
    @Input() email: string;
    @Input() token: string;
    @Input() password: string;

    newPasswordConfirmation: string;

    constructor() {
    }

    get valid(): boolean {
        return !(this.email == null)
            && !(this.token == null)
            && !(this.password == null)
            && this.password === this.newPasswordConfirmation;
    }
}
